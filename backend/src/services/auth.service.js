import bcrypt from 'bcryptjs';
import UserRepository from '../repositories/user.repository.js';
import TokenRepository from '../repositories/token.repository.js';

export class AuthService {
  static async register({ email, name, password, role }) {
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('User already exists with this email');
      error.statusCode = 400;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserRepository.create({
      email,
      name,
      passwordHash,
      role,
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async login({ email, password }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async saveRefreshToken(userId, token, expiresAt) {
    return TokenRepository.create({ token, userId, expiresAt });
  }

  static async verifyRefreshToken(token) {
    const tokenDoc = await TokenRepository.findByToken(token);
    if (!tokenDoc) {
      const error = new Error('Invalid refresh token');
      error.statusCode = 401;
      throw error;
    }

    if (new Date() > tokenDoc.expiresAt) {
      await TokenRepository.deleteByToken(token);
      const error = new Error('Refresh token has expired');
      error.statusCode = 401;
      throw error;
    }

    return tokenDoc.user;
  }

  static async revokeRefreshToken(token) {
    return TokenRepository.deleteByToken(token);
  }
}

export default AuthService;
