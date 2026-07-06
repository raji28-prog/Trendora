import prisma from '../database/prisma.js';

export const getAll = async (req, res, next) => {
  try {
    const list = await prisma.post.findMany({
      orderBy: { scheduledFor: 'asc' }
    });
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const { content, platform, scheduledFor, businessId } = req.body;

    // Get or create a default business for the post
    let targetBizId = businessId;
    if (!targetBizId) {
      const firstBiz = await prisma.business.findFirst();
      targetBizId = firstBiz?.id;
    }

    if (!targetBizId) {
      return res.status(400).json({ success: false, message: 'A business is required to schedule a post' });
    }

    const item = await prisma.post.create({
      data: {
        content,
        platform: platform || 'INSTAGRAM',
        scheduledFor: new Date(scheduledFor),
        status: 'SCHEDULED',
        businessId: targetBizId
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
    await prisma.post.delete({ where: { id } });
    res.json({ success: true, message: 'Post removed from queue' });
  } catch (err) {
    next(err);
  }
};
