import prisma from '../database/prisma.js';

export class AssetRepository {
  static async findByUserId(userId, type) {
    const where = { userId };
    if (type) where.type = type;
    return prisma.asset.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async create({ userId, type, name, url, size, mimeType }) {
    return prisma.asset.create({
      data: { userId, type, name, url, size, mimeType },
    });
  }

  static async delete(id, userId) {
    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset || asset.userId !== userId) return null;
    return prisma.asset.delete({ where: { id } });
  }
}

export default AssetRepository;
