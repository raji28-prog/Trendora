import prisma from '../database/prisma.js';

export const getAll = async (req, res, next) => {
  try {
    const list = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, status, source, businessId, campaignId } = req.body;
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

    const item = await prisma.lead.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        status: status || 'NEW',
        source,
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
