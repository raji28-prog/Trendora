import env from './config/env.js';
import app from './app.js';
import prisma from './database/prisma.js';
import bcrypt from 'bcryptjs';

const PORT = env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Seed default admin if none exists
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin' }
    });

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('Admin@123', 10);
      await prisma.user.create({
        data: {
          email: 'admin',
          firstName: 'Trendora',
          lastName: 'Admin',
          passwordHash,
          role: 'ADMIN',
          status: 'ACTIVE',
          emailVerified: true
        }
      });
      console.log('Seed: Default admin account automatically created (User ID: admin / Password: Admin@123)');
    } else {
      console.log('Seed: Admin account already exists, skipping auto-seed.');
    }
  } catch (err) {
    console.error('Seed: Error seeding default admin:', err.message);
  }
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  if (process.env.NODE_ENV === 'production') {
    server.close(() => process.exit(1));
  }
});


