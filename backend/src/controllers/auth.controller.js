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
      maxAge: 7 * 24 * 60 * 60, // 7 days
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

  logoutAll = async (request, reply) => {
    await AuthService.revokeAllRefreshTokens(request.user.id);
    reply.clearCookie('refreshToken', { path: '/' });
    return reply.send({
      success: true,
      message: 'Logged out from all devices successfully',
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

  forgotPassword = async (request, reply) => {
    const { email } = request.body;
    const result = await AuthService.forgotPassword(email);
    return reply.send({
      success: true,
      message: 'If an account exists, a reset link has been generated.',
      data: result,
    });
  };

  resetPassword = async (request, reply) => {
    const { token, newPassword } = request.body;
    await AuthService.resetPassword(token, newPassword);
    return reply.send({
      success: true,
      message: 'Password reset successfully',
    });
  };

  changePassword = async (request, reply) => {
    const { currentPassword, newPassword } = request.body;
    await AuthService.changePassword(request.user.id, currentPassword, newPassword);
    return reply.send({
      success: true,
      message: 'Password changed successfully',
    });
  };

  resendVerification = async (request, reply) => {
    const { email } = request.body;
    const result = await AuthService.resendVerification(email);
    return reply.send({
      success: true,
      message: 'Verification link resent if account exists',
      data: result,
    });
  };

  verifyEmail = async (request, reply) => {
    const { token } = request.query;
    if (!token) {
      return reply.status(400).send({
        success: false,
        error: {
          statusCode: 400,
          message: 'Token is required',
        },
      });
    }
    await AuthService.verifyEmail(token);
    return reply.send({
      success: true,
      message: 'Email verified successfully',
    });
  };

  updateProfile = async (request, reply) => {
    const user = await AuthService.updateProfile(request.user.id, request.body);
    return reply.send({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  };

  serveUpload = async (request, reply) => {
    const { filename } = request.params;
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'uploads', filename);
    if (!fs.existsSync(filePath)) {
      return reply.status(404).send({
        success: false,
        error: {
          statusCode: 404,
          message: 'File not found',
        },
      });
    }
    let contentType = 'image/png';
    if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) {
      contentType = 'image/jpeg';
    } else if (filename.endsWith('.svg')) {
      contentType = 'image/svg+xml';
    } else if (filename.endsWith('.webp')) {
      contentType = 'image/webp';
    }
    const stream = fs.createReadStream(filePath);
    return reply.type(contentType).send(stream);
  };
}

export default AuthController;

