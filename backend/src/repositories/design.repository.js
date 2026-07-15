import prisma from '../database/prisma.js';

export class DesignRepository {
  static async findByUserId(userId) {
    return prisma.userDesign.findMany({
      where: { userId },
      include: { template: { select: { id: true, title: true, category: true } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  static async findById(id) {
    return prisma.userDesign.findUnique({
      where: { id },
      include: { template: true },
    });
  }

  static async create({ userId, templateId, title, dimensions, background, layers, thumbnail, status }) {
    return prisma.userDesign.create({
      data: { userId, templateId, title, dimensions, background, layers, thumbnail, status },
    });
  }

  static async update(id, { title, dimensions, background, layers, thumbnail, status }) {
    return prisma.userDesign.update({
      where: { id },
      data: { title, dimensions, background, layers, thumbnail, status },
    });
  }

  static async delete(id) {
    return prisma.userDesign.delete({ where: { id } });
  }

  static async duplicate(id, userId) {
    const original = await prisma.userDesign.findUnique({ where: { id } });
    if (!original) throw new Error('Design not found');
    const { id: _id, createdAt, updatedAt, ...data } = original;
    return prisma.userDesign.create({
      data: { ...data, userId, title: `${original.title} (Copy)`, status: 'DRAFT' },
    });
  }

  static async verifyOwnership(id, userId) {
    const design = await prisma.userDesign.findUnique({ where: { id } });
    return design?.userId === userId ? design : null;
  }
}

export default DesignRepository;
