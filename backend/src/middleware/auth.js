import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import UserRepository from '../repositories/user.repository.js';

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      // Verify JWT structure first (no DB call) — throws JsonWebTokenError if invalid
      const decoded = jwt.verify(token, env.JWT_SECRET);

      // DB lookup — may fail if Atlas is unreachable
      const user = await UserRepository.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            statusCode: 401,
            message: 'Unauthorized: User not found',
          },
        });
      }

      req.user = user;
      return next();
    }

    if (env.DEVELOPMENT_MODE) {
      try {
        let user = await UserRepository.findByEmail('admin@trendora.com');
        if (!user) {
          user = {
            id: 'mock-admin-id-123456789012',
            email: 'admin@trendora.com',
            firstName: 'Trendora',
            lastName: 'Admin',
            role: 'ADMIN',
            status: 'ACTIVE',
            emailVerified: true,
            hasBusiness: true
          };
        }
        req.user = user;
        return next();
      } catch (dbErr) {
        console.warn('DB lookup failed in DEVELOPMENT_MODE, falling back to static mock user:', dbErr.message);
        req.user = {
          id: 'mock-admin-id-123456789012',
          email: 'admin@trendora.com',
          firstName: 'Trendora',
          lastName: 'Admin',
          role: 'ADMIN',
          status: 'ACTIVE',
          emailVerified: true,
          hasBusiness: true
        };
        return next();
      }
    }

    return res.status(401).json({
      success: false,
      error: {
        statusCode: 401,
        message: 'Unauthorized: No token provided',
      },
    });
  } catch (err) {
    // Prisma/MongoDB connectivity failure → 503, not 401
    const isPrismaError =
      err?.code === 'P2010' ||
      err?.constructor?.name === 'PrismaClientKnownRequestError' ||
      err?.constructor?.name === 'PrismaClientInitializationError';

    if (isPrismaError) {
      return res.status(503).json({
        success: false,
        error: {
          statusCode: 503,
          message: 'Database is temporarily unavailable. Please try again shortly.',
        },
      });
    }

    return res.status(401).json({
      success: false,
      error: {
        statusCode: 401,
        message: 'Unauthorized: Invalid or expired token',
      },
    });
  }
}

export function authorize(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          statusCode: 401,
          message: 'Unauthorized',
        },
      });
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          statusCode: 403,
          message: 'Forbidden: You do not have permission to access this resource',
        },
      });
    }
    next();
  };
}
