import prisma from '../database/prisma.js';

// Database connection failure check
const isDbConnectionError = (err) => {
  if (!err) return false;
  return (
    err.constructor?.name === 'PrismaClientInitializationError' ||
    err.code === 'P2010' ||
    (err.message && (
      err.message.includes('Server selection timeout') ||
      err.message.includes('No available servers') ||
      err.message.includes('failed to connect') ||
      err.message.includes('Database connection')
    ))
  );
};

const mockTeam = [
  {
    id: "mock-team-1",
    name: "Alex Smith",
    email: "alex@trendora.com",
    role: "MANAGER",
    businessId: "mock-biz-id-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "mock-team-2",
    name: "Jamie Doe",
    email: "jamie@trendora.com",
    role: "EDITOR",
    businessId: "mock-biz-id-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const getAll = async (req, res, next) => {
  try {
    const list = await prisma.teamMember.findMany({
      where: {
        business: {
          ownerId: req.user.id
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: list });
  } catch (err) {
    if (isDbConnectionError(err) && (process.env.DEVELOPMENT_MODE === 'true' || process.env.DEVELOPMENT_MODE === '1')) {
      console.warn('⚠️ MongoDB Offline: Returning fallback mock team members in development mode');
      return res.json({ success: true, data: mockTeam });
    }
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const { name, email, role, businessId } = req.body;
    let targetBizId = businessId;

    try {
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
    } catch (dbErr) {
      if (isDbConnectionError(dbErr) && (process.env.DEVELOPMENT_MODE === 'true' || process.env.DEVELOPMENT_MODE === '1')) {
        console.warn('⚠️ MongoDB Offline: Simulating team member creation in development mode');
        return res.status(201).json({
          success: true,
          data: {
            id: `mock-team-${Date.now()}`,
            name,
            email,
            role: role || 'EDITOR',
            businessId: businessId || 'mock-biz-id-1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        });
      }
      throw dbErr;
    }

    if (!targetBizId) {
      return res.status(400).json({ success: false, message: 'A business profile is required to add a team member' });
    }

    const item = await prisma.teamMember.create({
      data: {
        name,
        email,
        role: role || 'EDITOR',
        businessId: targetBizId
      }
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    try {
      const existing = await prisma.teamMember.findUnique({
        where: { id },
        include: { business: true }
      });
      if (!existing || existing.business.ownerId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Forbidden: You do not own this team member' });
      }

      const item = await prisma.teamMember.update({
        where: { id },
        data: { name, email, role }
      });
      res.json({ success: true, data: item });
    } catch (dbErr) {
      if (isDbConnectionError(dbErr) && (process.env.DEVELOPMENT_MODE === 'true' || process.env.DEVELOPMENT_MODE === '1')) {
        console.warn('⚠️ MongoDB Offline: Simulating team member update in development mode');
        return res.json({
          success: true,
          data: {
            id,
            name,
            email,
            role,
            businessId: 'mock-biz-id-1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        });
      }
      throw dbErr;
    }
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    try {
      const existing = await prisma.teamMember.findUnique({
        where: { id },
        include: { business: true }
      });
      if (!existing || existing.business.ownerId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Forbidden: You do not own this team member' });
      }

      await prisma.teamMember.delete({ where: { id } });
      res.json({ success: true, message: 'Team member removed' });
    } catch (dbErr) {
      if (isDbConnectionError(dbErr) && (process.env.DEVELOPMENT_MODE === 'true' || process.env.DEVELOPMENT_MODE === '1')) {
        console.warn('⚠️ MongoDB Offline: Simulating team member deletion in development mode');
        return res.json({ success: true, message: 'Team member removed' });
      }
      throw dbErr;
    }
  } catch (err) {
    next(err);
  }
};
