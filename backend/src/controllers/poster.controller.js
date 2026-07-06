import prisma from '../database/prisma.js';
import fs from 'fs';
import path from 'path';

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
  const filename = `poster-${id}-${Date.now()}.${ext}`;
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${filename}`;
};

export const getAll = async (req, res, next) => {
  try {
    const list = await prisma.poster.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const { title, imageUrl, format, businessId } = req.body;
    let targetBizId = businessId;
    if (!targetBizId) {
      const firstBiz = await prisma.business.findFirst();
      if (firstBiz) {
        targetBizId = firstBiz.id;
      } else {
        const dummyBiz = await prisma.business.create({
          data: {
            name: 'Default Store',
            category: 'Retail',
            address: '123 Main St',
            phone: '555-0000',
            images: []
          }
        });
        targetBizId = dummyBiz.id;
      }
    }

    const tempId = Math.random().toString(36).substring(2, 10);
    const savedUrl = saveBase64Image(imageUrl, tempId);

    const item = await prisma.poster.create({
      data: {
        title,
        imageUrl: savedUrl || '',
        format: format || 'PNG',
        businessId: targetBizId
      }
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export default { getAll, create };
