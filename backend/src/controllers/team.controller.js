import prisma from '../database/prisma.js';

export const getAll = async (req, res, next) => {
  try {
    const list = await prisma.teamMember.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const { name, email, role, businessId } = req.body;

    let targetBizId = businessId;
    if (!targetBizId) {
      const firstBiz = await prisma.business.findFirst();
      targetBizId = firstBiz?.id;
    }

    if (!targetBizId) {
      return res.status(400).json({ success: false, message: 'A business is required to add a team member' });
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
    const item = await prisma.teamMember.update({
      where: { id },
      data: { name, email, role }
    });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.teamMember.delete({ where: { id } });
    res.json({ success: true, message: 'Team member removed' });
  } catch (err) {
    next(err);
  }
};
