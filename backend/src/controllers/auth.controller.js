import AuthService from '../services/auth.service.js';
import env from '../config/env.js';

export class AuthController {
  constructor(fastify) {
    this.fastify = fastify;
  }

  register = async (request, reply) => {
    const user = await AuthService.register(request.body);
    return reply.status(201).send({
      success: true,
      message: 'User registered successfully',
      data: { user },
    });
  };

  login = async (request, reply) => {
    const user = await AuthService.login(request.body);

    const accessToken = this.fastify.jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      { secret: env.JWT_SECRET, expiresIn: '15m' }
    );

    const refreshToken = this.fastify.jwt.sign(
      { id: user.id },
      { secret: env.JWT_REFRESH_SECRET, expiresIn: '7d' }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await AuthService.saveRefreshToken(user.id, refreshToken, expiresAt);

    reply.setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return reply.send({
      success: true,
      message: 'Login successful',
      data: {
        user,
        accessToken,
      },
    });
  };

  refresh = async (request, reply) => {
    const refreshToken = request.cookies.refreshToken || request.body?.refreshToken;
    if (!refreshToken) {
      return reply.status(401).send({
        success: false,
        error: {
          statusCode: 401,
          message: 'Refresh token is required',
        },
      });
    }

    const user = await AuthService.verifyRefreshToken(refreshToken);

    const accessToken = this.fastify.jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      { secret: env.JWT_SECRET, expiresIn: '15m' }
    );

    return reply.send({
      success: true,
      data: {
        accessToken,
      },
    });
  };

  logout = async (request, reply) => {
    const refreshToken = request.cookies.refreshToken || request.body?.refreshToken;
    if (refreshToken) {
      await AuthService.revokeRefreshToken(refreshToken);
    }

    reply.clearCookie('refreshToken', { path: '/' });

    return reply.send({
      success: true,
      message: 'Logged out successfully',
    });
  };

  me = async (request, reply) => {
    return reply.send({
      success: true,
      data: {
        user: request.user,
      },
    });
  };
}

export default AuthController;
