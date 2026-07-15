import prisma from '../database/prisma.js';

export class TemplateRepository {
  static async findAll({ category, search, isPremium, isTrending, isFeatured, isNew, skip = 0, take = 50 } = {}) {
    const where = {};
    if (category) where.category = { name: category };
    if (isPremium !== undefined) where.isPremium = isPremium;
    if (isTrending) where.isTrending = true;
    if (isFeatured) where.isFeatured = true;
    if (isNew) where.isNew = true;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } },
      ];
    }

    return prisma.template.findMany({
      where,
      include: { category: true },
      orderBy: [{ isFeatured: 'desc' }, { isTrending: 'desc' }, { usageCount: 'desc' }, { createdAt: 'desc' }],
      skip,
      take,
    });
  }

  static async findById(id) {
    return prisma.template.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  static async findCategories() {
    return prisma.templateCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { templates: true } },
      },
    });
  }

  static async incrementUsage(id) {
    return prisma.template.update({
      where: { id },
      data: { usageCount: { increment: 1 } },
    }).catch(() => null);
  }

  static async upsertCategory(data) {
    return prisma.templateCategory.upsert({
      where: { name: data.name },
      update: data,
      create: data,
    });
  }

  static async create(data) {
    return prisma.template.create({ data });
  }

  static async count(where = {}) {
    return prisma.template.count({ where });
  }
}

export default TemplateRepository;
