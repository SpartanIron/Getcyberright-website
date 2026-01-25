import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

// Extend Express Request type globally
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        role: string;
      };
    }
  }
}

// JWT Configuration - Require JWT_SECRET in production
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  console.error('[Auth] CRITICAL: JWT_SECRET environment variable is not set!');
  throw new Error('JWT_SECRET environment variable must be set');
}

console.log('[Auth] JWT Configuration loaded successfully');

// Keep for backward compatibility with existing code
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

// Generate JWT Token with tokenVersion for session invalidation
export const generateToken = (user: { id: number; username: string; role?: string; tokenVersion?: number }) => {
  console.log('[Auth] Generating token for user:', user.username, 'JWT_SECRET exists:', !!JWT_SECRET, 'length:', JWT_SECRET?.length || 0);
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username,
      role: user.role || 'user',
      tokenVersion: user.tokenVersion || 0
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );
};

// Generate Refresh Token with tokenVersion for session invalidation
export const generateRefreshToken = (user: { id: number; username: string; tokenVersion?: number }) => {
  return jwt.sign(
    { id: user.id, username: user.username, tokenVersion: user.tokenVersion || 0 },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN } as jwt.SignOptions
  );
};

// Verify JWT Token
export const verifyToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('[Auth] Token verified successfully, user:', (decoded as any).username);
    return decoded;
  } catch (error) {
    console.log('[Auth] Token verification error:', (error as Error).message);
    console.log('[Auth] JWT_SECRET exists:', !!JWT_SECRET, 'length:', JWT_SECRET?.length || 0);
    throw new Error('Invalid or expired token');
  }
};

// Hash Password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Compare Password
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Authentication Middleware
export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      console.log('[Auth] No token provided for:', req.path);
      return res.status(401).json({ 
        error: 'Access denied', 
        message: 'No token provided' 
      });
    }
    
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      console.log('[Auth] Token verification failed for:', req.path, 'Error:', (err as Error).message);
      return res.status(401).json({ 
        error: 'Access denied', 
        message: 'Invalid or expired token' 
      });
    }
    
    // Verify user still exists
    const user = await storage.getUser(decoded.id);
    if (!user) {
      return res.status(401).json({ 
        error: 'Access denied', 
        message: 'User not found' 
      });
    }
    
    // Check token version for session invalidation (password change invalidates all tokens)
    const currentTokenVersion = user.tokenVersion || 0;
    const tokenTokenVersion = decoded.tokenVersion || 0;
    if (tokenTokenVersion < currentTokenVersion) {
      console.log('[Auth] Token version mismatch - session invalidated:', req.path);
      return res.status(401).json({ 
        error: 'Session expired', 
        message: 'Your session has expired. Please log in again.' 
      });
    }
    
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role || 'user'
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Access denied', 
      message: 'Invalid token' 
    });
  }
};

// Optional Authentication (for endpoints that work with or without auth)
export const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      const decoded = verifyToken(token);
      const user = await storage.getUser(decoded.id);
      
      if (user) {
        // Check token version for session invalidation
        const currentTokenVersion = user.tokenVersion || 0;
        const tokenTokenVersion = decoded.tokenVersion || 0;
        if (tokenTokenVersion < currentTokenVersion) {
          // Session invalidated, continue without auth
          return next();
        }
        
        req.user = {
          id: decoded.id,
          username: decoded.username,
          role: decoded.role || 'user'
        };
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Role-based Authorization
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Access denied', 
        message: 'Authentication required' 
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'Insufficient permissions' 
      });
    }
    
    next();
  };
};

// Admin Only Middleware
export const requireAdmin = requireRole(['admin']);

// Moderator or Admin Middleware
export const requireModerator = requireRole(['admin', 'moderator']);

// Session Management
const activeSessions = new Map<number, Set<string>>();
const MAX_SESSIONS_PER_USER = 5;

export const trackSession = (userId: number, token: string) => {
  if (!activeSessions.has(userId)) {
    activeSessions.set(userId, new Set());
  }
  
  const userSessions = activeSessions.get(userId)!;
  
  // Remove oldest session if limit exceeded
  if (userSessions.size >= MAX_SESSIONS_PER_USER) {
    const oldestToken = userSessions.values().next().value;
    if (oldestToken) {
      userSessions.delete(oldestToken);
    }
  }
  
  userSessions.add(token);
};

export const revokeSession = (userId: number, token: string) => {
  const userSessions = activeSessions.get(userId);
  if (userSessions) {
    userSessions.delete(token);
  }
};

export const revokeAllSessions = (userId: number) => {
  activeSessions.delete(userId);
};

export const isSessionValid = (userId: number, token: string): boolean => {
  const userSessions = activeSessions.get(userId);
  return userSessions ? userSessions.has(token) : false;
};

// Password Validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Username Validation
export const validateUsername = (username: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  if (username.length > 30) {
    errors.push('Username must be no more than 30 characters long');
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, underscores, and hyphens');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Account Lockout Management
const lockedAccounts = new Map<number, { lockedUntil: number; attempts: number }>();

export const lockAccount = (userId: number, duration: number = 30 * 60 * 1000) => {
  lockedAccounts.set(userId, {
    lockedUntil: Date.now() + duration,
    attempts: 0
  });
};

export const unlockAccount = (userId: number) => {
  lockedAccounts.delete(userId);
};

export const isAccountLocked = (userId: number): boolean => {
  const lockInfo = lockedAccounts.get(userId);
  if (!lockInfo) return false;
  
  if (Date.now() > lockInfo.lockedUntil) {
    lockedAccounts.delete(userId);
    return false;
  }
  
  return true;
};

export const incrementFailedAttempts = (userId: number): number => {
  const lockInfo = lockedAccounts.get(userId) || { lockedUntil: 0, attempts: 0 };
  lockInfo.attempts++;
  
  if (lockInfo.attempts >= 5) {
    lockAccount(userId);
  } else {
    lockedAccounts.set(userId, lockInfo);
  }
  
  return lockInfo.attempts;
};

// Security Headers for Auth Endpoints
export const authSecurityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};