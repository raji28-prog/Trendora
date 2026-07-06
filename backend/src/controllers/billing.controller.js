import prisma from '../database/prisma.js';

export const getSubscription = async (req, res, next) => {
  try {
    const firstBiz = await prisma.business.findFirst();
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
    if (!targetBizId) {
      const firstBiz = await prisma.business.findFirst();
      targetBizId = firstBiz?.id;
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
