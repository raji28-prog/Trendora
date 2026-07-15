// api/index.js — Vercel Serverless Function entry point for the Express backend.
//
// Vercel invokes this file as a serverless function and passes (req, res) directly.
// The Express `app` handles routing internally. No app.listen() is called here.
//
// On cold start, the default admin account is seeded if it doesn't exist.

import app from '../backend/src/app.js';
import prisma from '../backend/src/database/prisma.js';
import bcrypt from 'bcryptjs';

// Seed default admin once per cold start (no-op if already exists)
let seeded = false;
const seedAdmin = async () => {
  if (seeded) return;
  seeded = true;
  try {
    const existing = await prisma.user.findUnique({ where: { email: 'admin' } });
    if (!existing) {
      const passwordHash = await bcrypt.hash('Admin@123', 10);
      await prisma.user.create({
        data: {
          email: 'admin',
          firstName: 'Trendora',
          lastName: 'Admin',
          passwordHash,
          role: 'ADMIN',
          status: 'ACTIVE',
          emailVerified: true,
        },
      });
      console.log('Seed: Default admin created (email: admin / password: Admin@123)');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

// Export the Express app as the default Vercel handler.
// Vercel wraps this in a serverless function automatically.
export default async (req, res) => {
  await seedAdmin();
  return app(req, res);
};
