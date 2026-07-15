import prisma from '../database/prisma.js';

export const getAll = async (req, res, next) => {
  try {
    const list = await prisma.ad.findMany({
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
    const { title, description, imageUrl, budget, startDate, endDate, status, businessId, campaignId } = req.body;
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

    const item = await prisma.ad.create({
      data: {
        title,
        description,
        imageUrl,
        budget: parseFloat(budget),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status || 'PENDING',
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
