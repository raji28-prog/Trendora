import prisma from '../database/prisma.js';

export const getAll = async (req, res, next) => {
  try {
    const list = await prisma.review.findMany({
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
    const { rating, comment, reviewerName, reviewerEmail, businessId } = req.body;
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

    const item = await prisma.review.create({
      data: {
        rating: parseInt(rating) || 5,
        comment,
        reviewerName: reviewerName || 'Anonymous Customer',
        reviewerEmail,
        businessId: targetBizId
      }
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export default { getAll, create };
