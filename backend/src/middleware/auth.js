import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import UserRepository from '../repositories/user.repository.js';

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          statusCode: 401,
          message: 'Unauthorized: No token provided',
        },
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
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
    next();
  } catch (err) {
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
