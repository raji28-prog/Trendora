import fs from 'fs';
import path from 'path';
import assert from 'assert';
import prisma from './src/database/prisma.js';
import cloudinary from './src/config/cloudinary.js';
import { create, update } from './src/controllers/business.controller.js';

async function runTests() {
  console.log('--- STARTING UPLOAD IMPLEMENTATION TESTS ---');

  // Create a temporary mock file on disk to simulate Multer upload
  const tempDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  const mockFilePath1 = path.join(tempDir, 'mock-file-1.jpg');
  const mockFilePath2 = path.join(tempDir, 'mock-file-2.jpg');
  fs.writeFileSync(mockFilePath1, 'mock content 1');
  fs.writeFileSync(mockFilePath2, 'mock content 2');

  const mockMulterFiles = [
    { path: mockFilePath1, fieldname: 'images', originalname: 'mock-file-1.jpg' },
    { path: mockFilePath2, fieldname: 'images', originalname: 'mock-file-2.jpg' }
  ];

  // Keep track of calls
  let uploadCalledCount = 0;
  const uploadedFiles = [];
  let dbCreatedData = null;
  let dbUpdatedData = null;

  // Mock Cloudinary upload
  cloudinary.uploader.upload = async (filePath, options) => {
    uploadCalledCount++;
    uploadedFiles.push(filePath);
    return {
      secure_url: `https://res.cloudinary.com/real_cloud/image/upload/v12345/mock-${path.basename(filePath)}`
    };
  };

  // Mock Prisma business create
  prisma.business.create = async ({ data }) => {
    dbCreatedData = data;
    return {
      id: 'biz-123',
      ...data,
      createdAt: new Date()
    };
  };

  // Mock Prisma business update
  prisma.business.update = async ({ where, data }) => {
    dbUpdatedData = data;
    return {
      id: where.id,
      ...data,
      updatedAt: new Date()
    };
  };

  prisma.business.findUnique = async () => {
    return { id: 'biz-123', ownerId: 'user-123', images: ['https://res.cloudinary.com/real_cloud/image/upload/v12345/old-image.jpg'] };
  };

  // 1. Verify Create Business
  console.log('Testing create business...');
  const reqCreate = {
    user: { id: 'user-123' },
    body: {
      name: 'Test Business',
      category: 'Food',
      address: '123 Test St',
      phone: '123-456',
      status: 'ACTIVE'
    },
    files: mockMulterFiles
  };

  let resStatus = null;
  let resJsonData = null;
  const resCreate = {
    status: (code) => {
      resStatus = code;
      return resCreate;
    },
    json: (data) => {
      resJsonData = data;
      return resCreate;
    }
  };

  await create(reqCreate, resCreate, (err) => {
    if (err) throw err;
  });

  assert.strictEqual(resStatus, 201, 'Status code should be 201');
  assert.ok(resJsonData.success, 'Response should indicate success');
  assert.strictEqual(uploadCalledCount, 2, 'Cloudinary upload should be called twice');
  assert.deepStrictEqual(uploadedFiles, [mockFilePath1, mockFilePath2], 'Cloudinary upload should receive the actual file paths');
  assert.deepStrictEqual(
    dbCreatedData.images,
    [
      'https://res.cloudinary.com/real_cloud/image/upload/v12345/mock-mock-file-1.jpg',
      'https://res.cloudinary.com/real_cloud/image/upload/v12345/mock-mock-file-2.jpg'
    ],
    'Prisma/MongoDB data should store the secure_urls'
  );
  assert.ok(!fs.existsSync(mockFilePath1), 'Temporary file 1 should be deleted');
  assert.ok(!fs.existsSync(mockFilePath2), 'Temporary file 2 should be deleted');
  console.log('Create business test PASSED.');

  // Reset trackers
  uploadCalledCount = 0;
  uploadedFiles.length = 0;

  // Re-create temp files for update test
  fs.writeFileSync(mockFilePath1, 'mock content 1');
  fs.writeFileSync(mockFilePath2, 'mock content 2');

  // 2. Verify Update Business
  console.log('Testing update business...');
  const reqUpdate = {
    user: { id: 'user-123' },
    params: { id: 'biz-123' },
    body: {
      name: 'Updated Business',
      category: 'Food',
      address: '123 Test St',
      phone: '123-456',
      status: 'ACTIVE',
      existingImages: ['https://res.cloudinary.com/real_cloud/image/upload/v12345/old-image.jpg']
    },
    files: [mockMulterFiles[0]] // Upload file 1
  };

  const resUpdate = {
    json: (data) => {
      resJsonData = data;
      return resUpdate;
    }
  };

  await update(reqUpdate, resUpdate, (err) => {
    if (err) throw err;
  });

  assert.ok(resJsonData.success, 'Response should indicate success');
  assert.strictEqual(uploadCalledCount, 1, 'Cloudinary upload should be called once');
  assert.deepStrictEqual(uploadedFiles, [mockFilePath1], 'Cloudinary upload should receive the actual file path');
  assert.deepStrictEqual(
    dbUpdatedData.images,
    [
      'https://res.cloudinary.com/real_cloud/image/upload/v12345/old-image.jpg',
      'https://res.cloudinary.com/real_cloud/image/upload/v12345/mock-mock-file-1.jpg'
    ],
    'Prisma/MongoDB data should combine existing and new secure_urls'
  );
  assert.ok(!fs.existsSync(mockFilePath1), 'Temporary file 1 should be deleted');
  console.log('Update business test PASSED.');

  // 3. Verify Upload Failure Cleanup and Error Propagation
  console.log('Testing upload failure behavior...');
  fs.writeFileSync(mockFilePath1, 'mock content 1');
  cloudinary.uploader.upload = async () => {
    throw new Error('Cloudinary error simulated');
  };

  let nextCalledWithError = null;
  await create(
    {
      user: { id: 'user-123' },
      body: {},
      files: [mockMulterFiles[0]]
    },
    resCreate,
    (err) => {
      nextCalledWithError = err;
    }
  );

  assert.ok(nextCalledWithError, 'Next should be called with an error on upload failure');
  assert.ok(nextCalledWithError.message.includes('Cloudinary error simulated'), 'Error message should propagate');
  assert.ok(!fs.existsSync(mockFilePath1), 'Temporary file should still be deleted on upload failure');
  console.log('Upload failure test PASSED.');

  // Clean up mock file 2 (if still exists)
  if (fs.existsSync(mockFilePath2)) {
    fs.unlinkSync(mockFilePath2);
  }

  console.log('--- ALL UPLOAD TESTS PASSED SUCCESSFULLY! ---');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
