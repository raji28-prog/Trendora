import prisma from '../database/prisma.js';
import fs from 'fs';
import path from 'path';
import { uploadToCloudinary } from '../config/cloudinary.js';

// Helper to save base64 image strings locally
const saveBase64Image = (base64Str, id) => {
  if (!base64Str || !base64Str.startsWith('data:image')) return base64Str;
  const dir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return null;
  const ext = matches[1].split('/')[1] || 'png';
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');
  const filename = `business-${id}-${Date.now()}.${ext}`;
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${filename}`;
};

// Parse images Json from DB helper
const parseImages = (item) => {
  let imagesArr = [];
  try {
    imagesArr = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
  } catch (e) {
    imagesArr = [];
  }
  return { ...item, images: Array.isArray(imagesArr) ? imagesArr : [] };
};

// Database connection failure check
const isDbConnectionError = (err) => {
  if (!err) return false;
  return (
    err.constructor?.name === 'PrismaClientInitializationError' ||
    err.code === 'P2010' ||
    (err.message && (
      err.message.includes('Server selection timeout') ||
      err.message.includes('No available servers') ||
      err.message.includes('failed to connect') ||
      err.message.includes('Database connection')
    ))
  );
};

// High-fidelity mock businesses for fallback in DEVELOPMENT_MODE
const mockBusinesses = [
  {
    id: "mock-biz-id-1",
    name: "Trendora Cafe",
    category: "Cafe & Restaurant",
    address: "123 Premium Lane, Coffee District",
    phone: "+1 (555) 019-2834",
    website: "https://trendoracafe.com",
    images: [],
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mock-biz-id-2",
    name: "Trendora Boutique",
    category: "Fashion Retail",
    address: "456 Editorial Blvd, Styling Hub",
    phone: "+1 (555) 019-5678",
    website: "https://trendoraboutique.com",
    images: [],
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/businesses — return only the authenticated user's businesses
export const getAll = async (req, res, next) => {
  try {
    const list = await prisma.business.findMany({
      where: { ownerId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: list.map(parseImages) });
  } catch (err) {
    if (isDbConnectionError(err) && (process.env.DEVELOPMENT_MODE === 'true' || process.env.DEVELOPMENT_MODE === '1')) {
      console.warn('⚠️ MongoDB Offline: Returning fallback mock businesses in development mode');
      return res.json({ success: true, data: mockBusinesses });
    }
    next(err);
  }
};

// GET /api/businesses/mine — return the user's single primary business (used for onboarding check)
export const getMine = async (req, res, next) => {
  try {
    const biz = await prisma.business.findFirst({
      where: { ownerId: req.user.id },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ success: true, data: biz ? parseImages(biz) : null });
  } catch (err) {
    if (isDbConnectionError(err) && (process.env.DEVELOPMENT_MODE === 'true' || process.env.DEVELOPMENT_MODE === '1')) {
      console.warn('⚠️ MongoDB Offline: Returning fallback primary business in development mode');
      return res.json({ success: true, data: mockBusinesses[0] });
    }
    next(err);
  }
};

// GET /api/businesses/:id — return a single business owned by the authenticated user
export const getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const biz = await prisma.business.findUnique({ where: { id } });
    if (!biz) {
      if ((process.env.DEVELOPMENT_MODE === 'true' || process.env.DEVELOPMENT_MODE === '1') && id.startsWith('mock-')) {
        const mockBiz = mockBusinesses.find(b => b.id === id) || mockBusinesses[0];
        return res.json({ success: true, data: mockBiz });
      }
      return res.status(404).json({ success: false, error: { message: 'Business not found' } });
    }
    // Ownership check
    if (biz.ownerId !== req.user.id) {
      return res.status(403).json({ success: false, error: { message: 'Forbidden: You do not own this business' } });
    }
    res.json({ success: true, data: parseImages(biz) });
  } catch (err) {
    if (isDbConnectionError(err) && (process.env.DEVELOPMENT_MODE === 'true' || process.env.DEVELOPMENT_MODE === '1')) {
      console.warn('⚠️ MongoDB Offline: Returning fallback business detail in development mode');
      const mockBiz = mockBusinesses.find(b => b.id === req.params.id) || mockBusinesses[0];
      return res.json({ success: true, data: mockBiz });
    }
    next(err);
  }
};

// Helper to upload files/base64 to Cloudinary and cleanup local files
const uploadAndCleanLocalFiles = async (files, base64Images) => {
  const filePaths = [];
  
  // 1. Files from Multer
  if (files && files.length > 0) {
    for (const file of files) {
      filePaths.push(file.path);
    }
  }

  // 2. Base64 images
  if (base64Images) {
    const imgs = Array.isArray(base64Images) ? base64Images : [base64Images];
    for (const img of imgs) {
      if (typeof img === 'string' && img.startsWith('data:image')) {
        const dir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        const matches = img.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const ext = matches[1].split('/')[1] || 'png';
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');
          const filename = `temp-upload-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
          const filePath = path.join(dir, filename);
          fs.writeFileSync(filePath, buffer);
          filePaths.push(filePath);
        }
      }
    }
  }

  const savedUrls = [];
  try {
    for (const filePath of filePaths) {
      const secureUrl = await uploadToCloudinary(filePath);
      savedUrls.push(secureUrl);
      // Delete temporary file on success
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    return savedUrls;
  } catch (error) {
    // If any upload fails, delete all files
    for (const filePath of filePaths) {
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (cleanupErr) {
          console.error('Failed to delete temp file on error cleanup:', cleanupErr);
        }
      }
    }
    throw error;
  }
};

// POST /api/businesses — create a business owned by the authenticated user
export const create = async (req, res, next) => {
  try {
    const { name, category, address, phone, website, status } = req.body;

    // Check if there are base64 images in body
    let base64Images = [];
    if (req.body.images) {
      const imgs = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
      base64Images = imgs.filter(img => typeof img === 'string' && img.startsWith('data:image'));
    }

    // Save images to Cloudinary (uploaded files + body base64 strings)
    const savedUrls = await uploadAndCleanLocalFiles(req.files || [], base64Images);
    const filteredUrls = savedUrls.filter(Boolean);

    const biz = await prisma.business.create({
      data: {
        name,
        category,
        address,
        phone,
        website,
        images: filteredUrls,
        status: status || 'ACTIVE',
        ownerId: req.user.id,  // ← Ownership: link to authenticated user
      },
    });

    res.status(201).json({
      success: true,
      data: { ...biz, images: filteredUrls },
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/businesses/:id — update only if the authenticated user owns it
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, address, phone, website, status } = req.body;

    const existing = await prisma.business.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: { message: 'Business not found' } });
    }

    // Ownership check — only the owner may update
    if (existing.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { statusCode: 403, message: 'Forbidden: You do not own this business' },
      });
    }

    // Extract existing image URLs vs new base64 images
    let existingUrls = [];
    let base64Images = [];

    // Check req.body.existingImages (typically from FormData)
    if (req.body.existingImages) {
      const extImgs = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
      for (const img of extImgs) {
        if (typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/uploads'))) {
          existingUrls.push(img);
        }
      }
    }

    // Check req.body.images (could be JSON payload or legacy format)
    if (req.body.images) {
      const imgs = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
      for (const img of imgs) {
        if (typeof img === 'string') {
          if (img.startsWith('data:image')) {
            base64Images.push(img);
          } else if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/uploads')) {
            if (!existingUrls.includes(img)) {
              existingUrls.push(img);
            }
          }
        }
      }
    }

    // Upload new files (from Multer and base64)
    const newUrls = await uploadAndCleanLocalFiles(req.files || [], base64Images);
    const filteredUrls = [...existingUrls, ...newUrls];

    const biz = await prisma.business.update({
      where: { id },
      data: { name, category, address, phone, website, images: filteredUrls, status },
    });

    res.json({ success: true, data: { ...biz, images: filteredUrls } });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/businesses/:id — delete only if the authenticated user owns it
export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.business.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: { message: 'Business not found' } });
    }

    // Ownership check
    if (existing.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { statusCode: 403, message: 'Forbidden: You do not own this business' },
      });
    }

    await prisma.business.delete({ where: { id } });
    res.json({ success: true, message: 'Business deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export default { getAll, getMine, getOne, create, update, remove };
