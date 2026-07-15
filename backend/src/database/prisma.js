import { PrismaClient } from '@prisma/client';
import env from '../config/env.js';

// In serverless environments, each function invocation can create a new
// PrismaClient if we're not careful, exhausting the MongoDB connection pool.
// We use a global singleton so warm Lambda invocations reuse the same client.
const globalForPrisma = globalThis;

if (!globalForPrisma.__prisma) {
  globalForPrisma.__prisma = new PrismaClient({
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
    log: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.__prisma;
export default prisma;
