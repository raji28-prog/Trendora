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
  const filename = `business-${id}-${Date.now()}.${ext}`;
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${filename}`;
};

export const getAll = async (req, res, next) => {
  try {
    const list = await prisma.business.findMany({
      orderBy: { createdAt: 'desc' }
    });
    // Parse images Json from DB
    const parsed = list.map(item => {
      let imagesArr = [];
      try {
        imagesArr = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
      } catch (e) {
        imagesArr = [];
      }
      return {
        ...item,
        images: Array.isArray(imagesArr) ? imagesArr : []
      };
    });
    res.json({ success: true, data: parsed });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const { name, category, address, phone, website, images, status } = req.body;
    const tempId = Math.random().toString(36).substring(2, 10);
    
    // Save images (images is array of base64 strings)
    const savedUrls = (images || []).map(img => saveBase64Image(img, tempId)).filter(Boolean);

    const biz = await prisma.business.create({
      data: {
        name,
        category,
        address,
        phone,
        website,
        images: savedUrls, // Prisma Client maps JSON objects natively
        status: status || 'ACTIVE'
      }
    });

    res.status(201).json({
      success: true,
      data: {
        ...biz,
        images: savedUrls
      }
    });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, address, phone, website, images, status } = req.body;

    const existing = await prisma.business.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: { message: 'Business not found' } });
    }

    const savedUrls = (images || []).map(img => {
      if (img.startsWith('/uploads')) return img;
      return saveBase64Image(img, id);
    }).filter(Boolean);

    const biz = await prisma.business.update({
      where: { id },
      data: {
        name,
        category,
        address,
        phone,
        website,
        images: savedUrls,
        status
      }
    });

    res.json({
      success: true,
      data: {
        ...biz,
        images: savedUrls
      }
    });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.business.delete({ where: { id } });
    res.json({ success: true, message: 'Business deleted successfully' });
  } catch (err) {
    next(err);
  }
};
export default { getAll, create, update, remove };
