import prisma from '../database/prisma.js';

export const getStats = async (req, res, next) => {
  try {
    const businesses = await prisma.business.count().catch(() => 0);
    const ads = await prisma.ad.count().catch(() => 0);
    const campaigns = await prisma.campaign.count().catch(() => 0);
    const leads = await prisma.lead.count().catch(() => 0);
    const posters = await prisma.poster.count().catch(() => 0);
    const reviews = await prisma.review.count().catch(() => 0);

    res.json({
      success: true,
      data: {
        businesses,
        ads,
        campaigns,
        leads,
        posters,
        reviews
      }
    });
  } catch (err) {
    next(err);
  }
};

export default { getStats };
