import prisma from '../database/prisma.js';

export async function healthRoutes(fastify, options) {
  fastify.get('/health', async (request, reply) => {
    let dbStatus = 'UP';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (e) {
      dbStatus = 'DOWN';
      request.log.error('Database connection failed in health check:', e);
    }

    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      database: dbStatus,
    };
  });
}

export default healthRoutes;
