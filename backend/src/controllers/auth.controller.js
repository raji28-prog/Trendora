import AuthService from '../services/auth.service.js';
import env from '../config/env.js';
import jwt from 'jsonwebtoken';
import prisma from '../database/prisma.js';

export class AuthController {
  static register = async (req, res, next) => {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  };

  static login = async (req, res, next) => {
    try {
      const user = await AuthService.login(req.body);

      const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      await AuthService.saveRefreshToken(user.id, refreshToken, expiresAt);

      res.cookie('refreshToken', refreshToken, {
        path: '/',
        secure: env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const business = await prisma.business.findFirst({
        where: { ownerId: user.id }
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            ...user,
            hasBusiness: !!business,
            business: business ? { id: business.id, name: business.name } : null
          },
          accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  static refresh = async (req, res, next) => {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          error: {
            statusCode: 401,
            message: 'Refresh token is required',
          },
        });
      }

      const user = await AuthService.verifyRefreshToken(refreshToken);

      const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({
        success: true,
        data: {
          accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  static logout = async (req, res, next) => {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      if (refreshToken) {
        await AuthService.revokeRefreshToken(refreshToken);
      }

      res.clearCookie('refreshToken', { path: '/' });

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (err) {
      next(err);
    }
  };

  static me = async (req, res, next) => {
    try {
      const { passwordHash: _, ...userWithoutPassword } = req.user;
      userWithoutPassword.name = `${req.user.firstName} ${req.user.lastName || ''}`.trim();
      
      const business = await prisma.business.findFirst({
        where: { ownerId: req.user.id }
      });

      res.json({
        success: true,
        data: {
          user: {
            ...userWithoutPassword,
            hasBusiness: !!business,
            business: business ? { id: business.id, name: business.name } : null
          },
        },
      });
    } catch (err) {
      next(err);
    }
  };
}

export default AuthController;
