import prisma from '../database/prisma.js';

export class TokenRepository {
  static async create({ token, userId, expiresAt }) {
    return prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  static async findByToken(token) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  static async deleteByToken(token) {
    return prisma.refreshToken.delete({ where: { token } }).catch(() => null);
  }

  static async deleteByUserId(userId) {
    return prisma.refreshToken.deleteMany({ where: { userId } });
  }

  static async deleteExpired() {
    return prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  }
}

export default TokenRepository;
