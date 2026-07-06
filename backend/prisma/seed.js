import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@trendora.com';
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log('Seed: Admin user already exists.');
    return;
  }

  const passwordHash = await bcrypt.hash('Password123', 10);
  const admin = await prisma.user.create({
    data: {
      email,
      firstName: 'Trendora',
      lastName: 'Admin',
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  console.log('Seed: Created administrative account:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
