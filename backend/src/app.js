import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import env from './config/env.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import healthRoutes from './routes/health.routes.js';

export function buildApp() {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === 'development' ? 'debug' : 'info',
      transport: env.NODE_ENV === 'development' ? {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      } : undefined,
    },
  });

  // Register plugins
  app.register(cors, {
    origin: true, // Allow dev origins, configure as needed for prod
    credentials: true,
  });

  app.register(cookie);

  app.register(jwt, {
    secret: env.JWT_SECRET,
  });

  // Set global error handler
  app.setErrorHandler(errorHandler);

  // Register routes
  app.register(authRoutes, { prefix: '/api/auth' });
  app.register(healthRoutes, { prefix: '/api' });

  return app;
}

export default buildApp;
