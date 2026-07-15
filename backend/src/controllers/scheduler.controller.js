import prisma from '../database/prisma.js';

export const getAll = async (req, res, next) => {
  try {
    const list = await prisma.post.findMany({
      where: {
        business: {
          ownerId: req.user.id
        }
      },
      orderBy: { scheduledFor: 'asc' }
    });
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const { content, platform, scheduledFor, businessId, campaignId } = req.body;
    let targetBizId = businessId;

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

    if (!targetBizId) {
      return res.status(400).json({ success: false, message: 'A business profile is required to schedule a post' });
    }

    const item = await prisma.post.create({
      data: {
        content,
        platform: platform || 'INSTAGRAM',
        scheduledFor: new Date(scheduledFor),
        status: 'SCHEDULED',
        businessId: targetBizId,
        campaignId
      }
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: { business: true }
    });
    if (!post || post.business.ownerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not own this scheduled post' });
    }
    await prisma.post.delete({ where: { id } });
    res.json({ success: true, message: 'Post removed from queue' });
  } catch (err) {
    next(err);
  }
};
