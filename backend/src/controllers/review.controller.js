import prisma from '../database/prisma.js';

export const getAll = async (req, res, next) => {
  try {
    const list = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } });
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
