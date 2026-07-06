import prisma from '../database/prisma.js';

export class UserRepository {
  static async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  }

  static async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  static async create(data) {
    return prisma.user.create({ data });
  }

  static async update(id, data) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}

export default UserRepository;
