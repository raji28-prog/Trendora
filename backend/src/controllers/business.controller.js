import prisma from '../database/prisma.js';
import { uploadToCloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

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

/**
 * Upload a set of images to Cloudinary (or return null if not configured).
 * Accepts:
 *  - multer memoryStorage files (req.files) — uses file.buffer
 *  - base64 data URI strings
 *
 * No local filesystem operations are performed.
 */
const uploadImagesToCloudinary = async (files = [], base64Images = []) => {
  const savedUrls = [];

  if (!isCloudinaryConfigured()) {
    // Cloudinary not configured — return raw base64 URLs as fallback
    for (const img of base64Images) {
      if (typeof img === 'string' && img.startsWith('data:image')) {
        savedUrls.push(img); // stored as-is in MongoDB
      }
    }
    return savedUrls;
  }

  // Upload multer buffer files
  for (const file of files) {
    if (file.buffer) {
      try {
        const url = await uploadToCloudinary(file.buffer, { folder: 'trendora_businesses' });
        if (url) savedUrls.push(url);
      } catch (err) {
        console.error('Cloudinary buffer upload failed:', err.message);
      }
    }
  }

  // Upload base64 images
  for (const img of base64Images) {
    if (typeof img === 'string' && img.startsWith('data:image')) {
      try {
        const url = await uploadToCloudinary(img, { folder: 'trendora_businesses' });
        if (url) savedUrls.push(url);
      } catch (err) {
        console.error('Cloudinary base64 upload failed:', err.message);
        savedUrls.push(img); // fallback: store base64 directly
      }
    }
  }

  return savedUrls;
};

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

// GET /api/businesses/mine — return the user's single primary business
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

// POST /api/businesses — create a business
export const create = async (req, res, next) => {
  try {
    const { name, category, address, phone, website, status } = req.body;

    // Collect base64 images from body
    let base64Images = [];
    if (req.body.images) {
      const imgs = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
      base64Images = imgs.filter(img => typeof img === 'string' && img.startsWith('data:image'));
    }

    const savedUrls = await uploadImagesToCloudinary(req.files || [], base64Images);

    const biz = await prisma.business.create({
      data: {
        name,
        category,
        address,
        phone,
        website,
        images: savedUrls,
        status: status || 'ACTIVE',
        ownerId: req.user.id,
      },
    });

    res.status(201).json({ success: true, data: { ...biz, images: savedUrls } });
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
    if (existing.ownerId !== req.user.id) {
      return res.status(403).json({ success: false, error: { statusCode: 403, message: 'Forbidden: You do not own this business' } });
    }

    // Separate existing URLs from new base64 images
    let existingUrls = [];
    let base64Images = [];

    if (req.body.existingImages) {
      const extImgs = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
      for (const img of extImgs) {
        if (typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://'))) {
          existingUrls.push(img);
        }
      }
    }

    if (req.body.images) {
      const imgs = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
      for (const img of imgs) {
        if (typeof img === 'string') {
          if (img.startsWith('data:image')) {
            base64Images.push(img);
          } else if (img.startsWith('http://') || img.startsWith('https://')) {
            if (!existingUrls.includes(img)) existingUrls.push(img);
          }
        }
      }
    }

    const newUrls = await uploadImagesToCloudinary(req.files || [], base64Images);
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

// DELETE /api/businesses/:id
export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.business.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: { message: 'Business not found' } });
    }
    if (existing.ownerId !== req.user.id) {
      return res.status(403).json({ success: false, error: { statusCode: 403, message: 'Forbidden: You do not own this business' } });
    }
    await prisma.business.delete({ where: { id } });
    res.json({ success: true, message: 'Business deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export default { getAll, getMine, getOne, create, update, remove };
