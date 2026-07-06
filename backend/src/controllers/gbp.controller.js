// Google Business Profile (GBP) Controller — mock/API-ready stub
// Replace mock data with real Google My Business API calls when credentials are available.

import prisma from '../database/prisma.js';

export const getProfile = async (req, res, next) => {
  try {
    const business = await prisma.business.findFirst();
    if (!business) {
      return res.json({ success: true, data: null });
    }

    // Mock GBP sync status — replace with real API response
    const gbpData = {
      businessId: business.id,
      businessName: business.name,
      address: business.address,
      phone: business.phone,
      website: business.website || '',
      syncStatus: 'SYNCED',
      lastSyncedAt: new Date().toISOString(),
      rating: 4.5,
      totalReviews: 28,
      views: { thisMonth: 1240, lastMonth: 980 },
      searches: { direct: 340, discovery: 900 },
      actions: { websiteClicks: 145, callClicks: 67, directionRequests: 89 },
      verificationStatus: 'VERIFIED'
    };

    res.json({ success: true, data: gbpData });
  } catch (err) {
    next(err);
  }
};

export const syncProfile = async (req, res, next) => {
  try {
    // Simulate an API sync call
    await new Promise(resolve => setTimeout(resolve, 800));
    res.json({
      success: true,
      message: 'Google Business Profile synced successfully',
      data: { syncedAt: new Date().toISOString(), status: 'SYNCED' }
    });
  } catch (err) {
    next(err);
  }
};
