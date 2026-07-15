import bcrypt from 'bcryptjs';
import { uploadToCloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import UserRepository from '../repositories/user.repository.js';
import TokenRepository from '../repositories/token.repository.js';
import ResetTokenRepository from '../repositories/resetToken.repository.js';
import VerifyTokenRepository from '../repositories/verifyToken.repository.js';
import AuditLogRepository from '../repositories/auditLog.repository.js';

export class AuthService {
  static async register({ email, name, password, role }) {
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('User already exists with this email');
      error.statusCode = 400;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const nameParts = (name || '').trim().split(/\s+/);
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || null;
    
    const user = await UserRepository.create({
      email,
      firstName,
      lastName,
      passwordHash,
      role,
    });

    // Create verification token automatically
    const verifyToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    await VerifyTokenRepository.create({ token: verifyToken, userId: user.id, expiresAt });

    // Audit log
    await AuditLogRepository.create({
      userId: user.id,
      action: 'USER_REGISTERED',
      details: 'User successfully created account',
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    userWithoutPassword.name = `${user.firstName} ${user.lastName || ''}`.trim();
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

    // Audit log
    await AuditLogRepository.create({
      userId: user.id,
      action: 'USER_LOGGED_IN',
      details: 'User successfully signed in',
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    userWithoutPassword.name = `${user.firstName} ${user.lastName || ''}`.trim();
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

    const { passwordHash: _, ...userWithoutPassword } = tokenDoc.user;
    userWithoutPassword.name = `${tokenDoc.user.firstName} ${tokenDoc.user.lastName || ''}`.trim();
    return userWithoutPassword;
  }

  static async revokeRefreshToken(token) {
    return TokenRepository.deleteByToken(token);
  }

  static async revokeAllRefreshTokens(userId) {
    return TokenRepository.deleteByUserId(userId);
  }

  static async forgotPassword(email) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      return { success: true };
    }
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour
    await ResetTokenRepository.create({ token, userId: user.id, expiresAt });
    
    // Audit log
    await AuditLogRepository.create({
      userId: user.id,
      action: 'PASSWORD_RESET_REQUESTED',
      details: 'Reset password link generated',
    });
    return { token };
  }

  static async resetPassword(token, newPassword) {
    const resetToken = await ResetTokenRepository.findByToken(token);
    if (!resetToken) {
      const error = new Error('Invalid or expired reset token');
      error.statusCode = 400;
      throw error;
    }
    if (new Date() > resetToken.expiresAt) {
      await ResetTokenRepository.deleteByToken(token);
      const error = new Error('Reset token has expired');
      error.statusCode = 400;
      throw error;
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await UserRepository.update(resetToken.userId, { passwordHash });
    await ResetTokenRepository.deleteByToken(token);
    
    // Audit log
    await AuditLogRepository.create({
      userId: resetToken.userId,
      action: 'PASSWORD_RESET_COMPLETED',
      details: 'Password was reset successfully using token',
    });
    return { success: true };
  }

  static async changePassword(userId, currentPassword, newPassword) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      const error = new Error('Invalid current password');
      error.statusCode = 400;
      throw error;
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await UserRepository.update(userId, { passwordHash });
    
    // Audit log
    await AuditLogRepository.create({
      userId,
      action: 'PASSWORD_CHANGED',
      details: 'User updated password from profile settings',
    });
    return { success: true };
  }

  static async resendVerification(email) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      return { success: true };
    }
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    await VerifyTokenRepository.create({ token, userId: user.id, expiresAt });
    
    // Audit log
    await AuditLogRepository.create({
      userId: user.id,
      action: 'EMAIL_VERIFICATION_SENT',
      details: 'Verification link resent',
    });
    return { token };
  }

  static async verifyEmail(token) {
    const verifyToken = await VerifyTokenRepository.findByToken(token);
    if (!verifyToken) {
      const error = new Error('Invalid or expired verification token');
      error.statusCode = 400;
      throw error;
    }
    if (new Date() > verifyToken.expiresAt) {
      await VerifyTokenRepository.deleteByToken(token);
      const error = new Error('Verification token has expired');
      error.statusCode = 400;
      throw error;
    }
    await UserRepository.update(verifyToken.userId, { emailVerified: true });
    await VerifyTokenRepository.deleteByToken(token);
    
    // Audit log
    await AuditLogRepository.create({
      userId: verifyToken.userId,
      action: 'EMAIL_VERIFIED',
      details: 'Email successfully verified',
    });
    return { success: true };
  }

  static async updateProfile(userId, { name, phone, profileImage }) {
    const data = {};
    if (name) {
      const [firstName, ...lastNameParts] = name.trim().split(' ');
      data.firstName = firstName;
      data.lastName = lastNameParts.join(' ') || null;
    }
    if (phone !== undefined) data.phone = phone;
    
    if (profileImage && profileImage.startsWith('data:image')) {
      // Upload profile image to Cloudinary (no local disk writes)
      if (isCloudinaryConfigured()) {
        try {
          const url = await uploadToCloudinary(profileImage, { folder: 'trendora_profiles' });
          if (url) data.profileImage = url;
        } catch (err) {
          console.warn('Cloudinary profile image upload failed, storing as-is:', err.message);
          data.profileImage = profileImage; // fallback: store base64 in DB
        }
      } else {
        data.profileImage = profileImage; // store base64 directly when Cloudinary not configured
      }
    } else if (profileImage !== undefined) {
      data.profileImage = profileImage;
    }

    const user = await UserRepository.update(userId, data);
    
    // Audit log
    await AuditLogRepository.create({
      userId,
      action: 'PROFILE_UPDATED',
      details: 'User updated profile details',
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    userWithoutPassword.name = `${user.firstName} ${user.lastName || ''}`.trim();
    return userWithoutPassword;
  }
}

export default AuthService;

