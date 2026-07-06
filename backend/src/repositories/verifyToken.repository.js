import prisma from '../database/prisma.js';

export class VerifyTokenRepository {
  static async create({ token, userId, expiresAt }) {
    await prisma.emailVerificationToken.deleteMany({ where: { userId } }).catch(() => null);
    return prisma.emailVerificationToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  static async findByToken(token) {
    return prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  static async deleteByToken(token) {
    return prisma.emailVerificationToken.delete({ where: { token } }).catch(() => null);
  }
}

export default VerifyTokenRepository;
