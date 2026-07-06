import AuthController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  resetPasswordRequestSchema,
  resetPasswordConfirmSchema,
  changePasswordSchema,
  updateProfileSchema,
  resendVerificationSchema,
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
  fastify.post('/logout-all', { preHandler: [authenticate] }, controller.logoutAll);
  fastify.get('/me', { preHandler: [authenticate] }, controller.me);
  
  fastify.post('/forgot-password', { preValidation: [validate(resetPasswordRequestSchema)] }, controller.forgotPassword);
  fastify.post('/reset-password', { preValidation: [validate(resetPasswordConfirmSchema)] }, controller.resetPassword);
  fastify.post('/change-password', { preHandler: [authenticate], preValidation: [validate(changePasswordSchema)] }, controller.changePassword);
  fastify.post('/resend-verification', { preValidation: [validate(resendVerificationSchema)] }, controller.resendVerification);
  fastify.get('/verify-email', controller.verifyEmail);
  fastify.put('/profile', { preHandler: [authenticate], preValidation: [validate(updateProfileSchema)] }, controller.updateProfile);
  
  // Custom static uploads serving
  fastify.get('/uploads/:filename', controller.serveUpload);
}

export default authRoutes;
