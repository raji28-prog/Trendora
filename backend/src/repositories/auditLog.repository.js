import prisma from '../database/prisma.js';

export class AuditLogRepository {
  static async create({ userId, action, details, ipAddress, userAgent }) {
    return prisma.auditLog.create({
      data: {
        userId,
        action,
        details,
        ipAddress,
        userAgent,
      },
    });
  }

  static async findByUserId(userId) {
    return prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default AuditLogRepository;
