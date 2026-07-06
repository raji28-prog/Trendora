import prisma from '../database/prisma.js';

export class ResetTokenRepository {
  static async create({ token, userId, expiresAt }) {
    await prisma.passwordResetToken.deleteMany({ where: { userId } }).catch(() => null);
    return prisma.passwordResetToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  static async findByToken(token) {
    return prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  static async deleteByToken(token) {
    return prisma.passwordResetToken.delete({ where: { token } }).catch(() => null);
  }
}

export default ResetTokenRepository;
