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
  const filename = `poster-${id}-${Date.now()}.${ext}`;
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${filename}`;
};

export const getAll = async (req, res, next) => {
  try {
    const list = await prisma.poster.findMany({
      where: {
        business: {
          ownerId: req.user.id
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const { title, imageUrl, format, businessId, campaignId } = req.body;
    let targetBizId = businessId;
    if (!targetBizId) {
      const firstBiz = await prisma.business.findFirst({
        where: { ownerId: req.user.id }
      });
      if (firstBiz) {
        targetBizId = firstBiz.id;
      } else {
        return res.status(400).json({ success: false, error: { message: 'Business profile required.' } });
      }
    } else {
      const biz = await prisma.business.findFirst({
        where: { id: targetBizId, ownerId: req.user.id }
      });
      if (!biz) {
        return res.status(403).json({ success: false, error: { message: 'Forbidden: You do not own this business' } });
      }
    }

    let savedUrl = imageUrl;
    if (imageUrl && imageUrl.startsWith('data:image')) {
      savedUrl = await uploadToCloudinary(imageUrl);
    } else {
      const tempId = Math.random().toString(36).substring(2, 10);
      savedUrl = saveBase64Image(imageUrl, tempId);
    }

    const item = await prisma.poster.create({
      data: {
        title,
        imageUrl: savedUrl || '',
        format: format || 'PNG',
        businessId: targetBizId,
        campaignId
      }
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export default { getAll, create };
