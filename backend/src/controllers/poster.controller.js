import prisma from '../database/prisma.js';
import { uploadToCloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

/**
 * Upload a base64 image to Cloudinary or return the raw value as a fallback.
 * No filesystem operations — pure in-memory / Cloudinary.
 */
const persistImage = async (imageUrl) => {
  if (!imageUrl) return null;

  // Already a hosted URL — return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    if (isCloudinaryConfigured()) {
      try {
        return await uploadToCloudinary(imageUrl, { folder: 'trendora_posters' });
      } catch (err) {
        console.warn('Cloudinary re-upload failed, using original URL:', err.message);
        return imageUrl;
      }
    }
    return imageUrl;
  }

  // base64 data URI
  if (imageUrl.startsWith('data:image')) {
    if (isCloudinaryConfigured()) {
      try {
        return await uploadToCloudinary(imageUrl, { folder: 'trendora_posters' });
      } catch (err) {
        console.warn('Cloudinary base64 upload failed, storing raw base64:', err.message);
        return imageUrl; // store as-is — no disk write needed
      }
    }
    return imageUrl; // store as-is when Cloudinary not configured
  }

  return imageUrl;
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
      const firstBiz = await prisma.business.findFirst({ where: { ownerId: req.user.id } });
      if (firstBiz) {
        targetBizId = firstBiz.id;
      } else {
        return res.status(400).json({ success: false, error: { message: 'Business profile required.' } });
      }
    } else {
      const biz = await prisma.business.findFirst({ where: { id: targetBizId, ownerId: req.user.id } });
      if (!biz) {
        return res.status(403).json({ success: false, error: { message: 'Forbidden: You do not own this business' } });
      }
    }

    const savedUrl = await persistImage(imageUrl);

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
