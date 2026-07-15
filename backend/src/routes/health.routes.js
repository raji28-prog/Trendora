import { Router } from 'express';
import prisma from '../database/prisma.js';

const router = Router();

router.get('/', async (req, res) => {
  let dbStatus = 'UP';
  try {
    // MongoDB health check — $runCommandRaw works with Prisma's MongoDB adapter
    await prisma.$runCommandRaw({ ping: 1 });
  } catch (e) {
    dbStatus = 'DOWN';
    console.error('Database health check failed:', e.message);
  }

  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

export default router;
