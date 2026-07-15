import prisma from '../database/prisma.js';

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

export const getSubscription = async (req, res, next) => {
  try {
    let firstBiz = null;
    try {
      firstBiz = await prisma.business.findFirst({
        where: { ownerId: req.user.id }
      });
    } catch (dbErr) {
      if (isDbConnectionError(dbErr) && (process.env.DEVELOPMENT_MODE === 'true' || process.env.DEVELOPMENT_MODE === '1')) {
        console.warn('⚠️ MongoDB Offline: Returning fallback mock FREE subscription in development mode');
        return res.json({
          success: true,
          data: {
            id: 'mock-sub-id',
            plan: 'FREE',
            status: 'ACTIVE',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            businessId: 'mock-biz-id-1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        });
      }
      throw dbErr;
    }

    if (!firstBiz) {
      return res.json({ success: true, data: null });
    }
    const sub = await prisma.subscription.findFirst({
      where: { businessId: firstBiz.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: sub });
  } catch (err) {
    next(err);
  }
};

export const createOrUpdate = async (req, res, next) => {
  try {
    const { plan, businessId } = req.body;

    let targetBizId = businessId;
    try {
      if (!targetBizId) {
        const firstBiz = await prisma.business.findFirst({
          where: { ownerId: req.user.id }
        });
        targetBizId = firstBiz?.id;
      } else {
        const biz = await prisma.business.findFirst({
          where: { id: targetBizId, ownerId: req.user.id }
        });
        if (!biz) {
          return res.status(403).json({ success: false, message: 'Forbidden: You do not own this business' });
        }
      }
    } catch (dbErr) {
      if (isDbConnectionError(dbErr) && (process.env.DEVELOPMENT_MODE === 'true' || process.env.DEVELOPMENT_MODE === '1')) {
        console.warn('⚠️ MongoDB Offline: Simulating subscription update in development mode');
        return res.status(201).json({
          success: true,
          data: {
            id: 'mock-sub-id',
            plan: plan || 'FREE',
            status: 'ACTIVE',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            businessId: businessId || 'mock-biz-id-1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        });
      }
      throw dbErr;
    }

    if (!targetBizId) {
      return res.status(400).json({ success: false, message: 'No business found to attach subscription' });
    }

    // Calculate expiry: 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Deactivate old subscriptions
    await prisma.subscription.updateMany({
      where: { businessId: targetBizId, status: 'ACTIVE' },
      data: { status: 'CANCELED' }
    });

    const sub = await prisma.subscription.create({
      data: {
        plan: plan || 'FREE',
        status: 'ACTIVE',
        expiresAt,
        businessId: targetBizId
      }
    });

    res.status(201).json({ success: true, data: sub });
  } catch (err) {
    next(err);
  }
};
