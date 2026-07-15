// Google Business Profile (GBP) Controller — mock/API-ready stub
// Replace mock data with real Google My Business API calls when credentials are available.

import prisma from '../database/prisma.js';

export const getProfile = async (req, res, next) => {
  try {
    const { businessId } = req.query;
    const query = { ownerId: req.user.id };
    if (businessId) {
      query.id = businessId;
    }

    let business = null;
    try {
      business = await prisma.business.findFirst({
        where: query
      });
    } catch (dbErr) {
      const isConnectionError =
        dbErr.constructor?.name === 'PrismaClientInitializationError' ||
        dbErr.code === 'P2010' ||
        (dbErr.message && (
          dbErr.message.includes('Server selection timeout') ||
          dbErr.message.includes('No available servers') ||
          dbErr.message.includes('failed to connect') ||
          dbErr.message.includes('Database connection')
        ));
      
      if (isConnectionError && (process.env.DEVELOPMENT_MODE === 'true' || process.env.DEVELOPMENT_MODE === '1')) {
        console.warn('⚠️ MongoDB Offline: Returning fallback mock GBP profile in development mode');
        // Synthesize mock business values for GBP data
        business = {
          id: businessId || 'mock-biz-id-1',
          name: 'Trendora Cafe',
          address: '123 Premium Lane, Coffee District',
          phone: '+1 (555) 019-2834',
          website: 'https://trendoracafe.com'
        };
      } else {
        throw dbErr;
      }
    }

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
