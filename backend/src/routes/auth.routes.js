import AuthController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../validations/auth.schema.js';

export async function authRoutes(fastify, options) {
  const controller = new AuthController(fastify);

  const validate = (schema) => {
    return async (request, reply) => {
      const result = schema.safeParse(request.body);
      if (!result.success) {
        return reply.status(400).send({
          success: false,
          error: {
            statusCode: 400,
            message: 'Validation failed',
            details: result.error.format(),
          },
        });
      }
      request.body = result.data;
    };
  };

  fastify.post('/register', { preValidation: [validate(registerSchema)] }, controller.register);
  fastify.post('/login', { preValidation: [validate(loginSchema)] }, controller.login);
  fastify.post('/refresh', { preValidation: [validate(refreshTokenSchema)] }, controller.refresh);
  fastify.post('/logout', controller.logout);
  fastify.get('/me', { preHandler: [authenticate] }, controller.me);
}

export default authRoutes;
