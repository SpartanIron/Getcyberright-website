import type { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import crypto from "crypto";
import { db } from "./db";
import { users, registerSchema, loginSchema, passwordResetRequestSchema, passwordResetSchema, changePasswordSchema, mfaVerifySchema } from "@shared/schema";
import { eq } from "drizzle-orm";
import { securityLogger, failedLoginTracker, ipBlocklist } from "./security";
import { z } from "zod";

// Constants
const SALT_ROUNDS = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;
const TOKEN_EXPIRY_HOURS = 24;
const PASSWORD_RESET_EXPIRY_HOURS = 1;

// Extend Express Session
declare module "express-session" {
  interface SessionData {
    userId?: string;
    mfaPending?: boolean;
    tempUserId?: string;
  }
}

// Generate secure random token
function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Generate 6-digit OTP code using cryptographically secure random
function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

// Authentication middleware
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    const [user] = await db.select().from(users).where(eq(users.id, req.session.userId));
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: "User not found" });
    }
    
    // Attach user to request
    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Authentication error" });
  }
};

// Check if account is locked
function isAccountLocked(user: any): boolean {
  if (!user.lockedUntil) return false;
  return new Date(user.lockedUntil) > new Date();
}

// Increment failed login attempts
async function incrementFailedAttempts(userId: string): Promise<void> {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return;
  
  const attempts = parseInt(user.failedLoginAttempts || "0") + 1;
  const updateData: any = { failedLoginAttempts: attempts.toString() };
  
  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    const lockUntil = new Date();
    lockUntil.setMinutes(lockUntil.getMinutes() + LOCKOUT_DURATION_MINUTES);
    updateData.lockedUntil = lockUntil;
    securityLogger.warn("Account locked due to failed attempts", { userId, attempts });
  }
  
  await db.update(users).set(updateData).where(eq(users.id, userId));
}

// Reset failed login attempts
async function resetFailedAttempts(userId: string): Promise<void> {
  await db.update(users).set({ 
    failedLoginAttempts: "0", 
    lockedUntil: null 
  }).where(eq(users.id, userId));
}

// Register auth routes
export function registerAuthRoutes(app: Express) {
  // Set up session middleware
  const PgStore = connectPg(session);
  
  const sessionSecret = process.env.SESSION_SECRET;
  const isProduction = process.env.NODE_ENV === "production";
  const isReplit = !!process.env.REPLIT_DOMAINS || !!process.env.REPL_SLUG;
  
  if (!sessionSecret) {
    if (isProduction) {
      throw new Error("SESSION_SECRET must be set in production environment");
    }
    console.warn("SESSION_SECRET not set, using fallback secret (NOT for production!)");
  }
  
  // On Replit, always use secure cookies since it serves over HTTPS
  const useSecureCookies = isProduction || isReplit;
  
  app.use(session({
    store: new PgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      tableName: "sessions",
    }),
    secret: sessionSecret || "dev-fallback-secret-change-me",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: useSecureCookies,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
    name: "gcr.sid",
  }));
  
  // Register new user - DISABLED (admin-only system)
  app.post("/api/auth/register", async (req, res) => {
    return res.status(403).json({ error: "Public registration is disabled. Please contact an administrator." });
    
    // Original registration code disabled:
    /*
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user exists
      const [existing] = await db.select().from(users).where(eq(users.email, validatedData.email.toLowerCase()));
      if (existing) {
        return res.status(400).json({ error: "An account with this email already exists" });
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(validatedData.password, SALT_ROUNDS);
      
      // Generate email verification token
      const emailVerificationToken = generateToken();
      const emailVerificationExpires = new Date();
      emailVerificationExpires.setHours(emailVerificationExpires.getHours() + TOKEN_EXPIRY_HOURS);
      
      // Create user
      const [newUser] = await db.insert(users).values({
        email: validatedData.email.toLowerCase(),
        passwordHash,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        emailVerificationToken,
        emailVerificationExpires,
        mustChangePassword: true,
      }).returning();
      
      securityLogger.info("New user registered", { userId: newUser.id, email: validatedData.email });
      
      // In production, send verification email here
      // For now, auto-verify in development
      if (process.env.NODE_ENV !== "production") {
        await db.update(users).set({ 
          emailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpires: null
        }).where(eq(users.id, newUser.id));
      }
      
      res.json({ 
        success: true, 
        message: "Account created successfully. Please check your email to verify your account.",
        requiresVerification: process.env.NODE_ENV === "production"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
    */
  });
  
  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const clientIp = req.ip || req.socket.remoteAddress || "unknown";
      
      // Check if IP is blocked due to brute force attempts
      const blockStatus = ipBlocklist.isBlocked(clientIp);
      if (blockStatus.blocked) {
        return res.status(403).json({ 
          error: "Too many failed login attempts. Please try again later.",
          retryAfter: Math.ceil((blockStatus.remainingMs || 0) / 1000)
        });
      }
      
      // Find user
      const [user] = await db.select().from(users).where(eq(users.email, validatedData.email.toLowerCase()));
      if (!user || !user.passwordHash) {
        // Track failed attempt even for non-existent users (prevents user enumeration)
        failedLoginTracker.recordFailedAttempt(clientIp, validatedData.email);
        securityLogger.warn("Login attempt for non-existent user", { email: validatedData.email, ip: clientIp });
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      // Check if account is locked
      if (isAccountLocked(user)) {
        securityLogger.warn("Login attempt on locked account", { userId: user.id, ip: clientIp });
        return res.status(423).json({ 
          error: "Account temporarily locked due to too many failed attempts. Please try again later." 
        });
      }
      
      // Verify password
      const passwordValid = await bcrypt.compare(validatedData.password, user.passwordHash);
      if (!passwordValid) {
        await incrementFailedAttempts(user.id);
        // Track IP-based brute force attempts
        failedLoginTracker.recordFailedAttempt(clientIp, user.email);
        securityLogger.warn("Failed login attempt", { userId: user.id, ip: clientIp });
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      // Check email verification
      if (!user.emailVerified) {
        return res.status(403).json({ 
          error: "Please verify your email before logging in",
          requiresVerification: true
        });
      }
      
      // Check if MFA is enabled
      if (user.mfaEnabled && user.mfaSecret) {
        if (!validatedData.mfaCode) {
          // Set pending MFA state
          req.session.mfaPending = true;
          req.session.tempUserId = user.id;
          return res.json({ 
            success: false,
            requiresMfa: true,
            message: "Please enter your authentication code"
          });
        }
        
        // Verify MFA code
        const verified = speakeasy.totp.verify({
          secret: user.mfaSecret,
          encoding: "base32",
          token: validatedData.mfaCode,
          window: 1
        });
        
        if (!verified) {
          // Check backup codes
          const backupCodes = user.mfaBackupCodes ? JSON.parse(user.mfaBackupCodes) : [];
          const codeIndex = backupCodes.findIndex((c: string) => {
            try {
              return c.length === validatedData.mfaCode.length &&
                crypto.timingSafeEqual(Buffer.from(c, 'utf8'), Buffer.from(validatedData.mfaCode, 'utf8'));
            } catch { return false; }
          });
          
          if (codeIndex === -1) {
            await incrementFailedAttempts(user.id);
            failedLoginTracker.recordFailedAttempt(clientIp, user.email); // Track MFA failures
            securityLogger.warn("Failed MFA verification", { userId: user.id, ip: clientIp });
            return res.status(401).json({ error: "Invalid authentication code" });
          }
          
          // Remove used backup code
          backupCodes.splice(codeIndex, 1);
          await db.update(users).set({ 
            mfaBackupCodes: JSON.stringify(backupCodes) 
          }).where(eq(users.id, user.id));
          
          securityLogger.info("Backup code used for MFA", { userId: user.id });
        }
      }
      
      // Reset failed attempts and update login info
      await resetFailedAttempts(user.id);
      failedLoginTracker.recordSuccessfulLogin(clientIp); // Clear IP-based tracking
      await db.update(users).set({
        lastLoginAt: new Date(),
        lastLoginIp: clientIp,
        updatedAt: new Date()
      }).where(eq(users.id, user.id));
      
      // Regenerate session to prevent session fixation attacks
      const oldSession = { ...req.session };
      req.session.regenerate((regenerateErr) => {
        if (regenerateErr) {
          console.error("Session regeneration error:", regenerateErr);
          return res.status(500).json({ error: "Login failed" });
        }

        req.session.userId = user.id;
        req.session.mfaPending = false;
        req.session.tempUserId = undefined;

        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return res.status(500).json({ error: "Login failed" });
          }
          
          securityLogger.info("Successful login", { userId: user.id, ip: clientIp });
          
          res.json({ 
            success: true,
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              mfaEnabled: user.mfaEnabled,
              mustChangePassword: user.mustChangePassword,
              subscriptionTier: user.subscriptionTier,
              isAdmin: user.isAdmin
            }
          });
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  
  // Verify MFA (for pending MFA sessions)
  app.post("/api/auth/verify-mfa", async (req, res) => {
    try {
      if (!req.session.mfaPending || !req.session.tempUserId) {
        return res.status(400).json({ error: "No MFA verification pending" });
      }
      
      const { code } = mfaVerifySchema.parse(req.body);
      const clientIp = req.ip || req.socket.remoteAddress || "unknown";
      
      const [user] = await db.select().from(users).where(eq(users.id, req.session.tempUserId));
      if (!user || !user.mfaSecret) {
        return res.status(400).json({ error: "Invalid session" });
      }
      
      // Verify TOTP code
      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: "base32",
        token: code,
        window: 1
      });
      
      if (!verified) {
        // Check backup codes with timing-safe comparison
        const backupCodes = user.mfaBackupCodes ? JSON.parse(user.mfaBackupCodes) : [];
        const codeIndex = backupCodes.findIndex((c: string) => {
          try {
            return c.length === code.length &&
              crypto.timingSafeEqual(Buffer.from(c, 'utf8'), Buffer.from(code, 'utf8'));
          } catch { return false; }
        });
        
        if (codeIndex === -1) {
          await incrementFailedAttempts(user.id);
          failedLoginTracker.recordFailedAttempt(clientIp, user.email);
          return res.status(401).json({ error: "Invalid authentication code" });
        }
        
        // Remove used backup code
        backupCodes.splice(codeIndex, 1);
        await db.update(users).set({ 
          mfaBackupCodes: JSON.stringify(backupCodes) 
        }).where(eq(users.id, user.id));
      }
      
      // Complete login
      await resetFailedAttempts(user.id);
      failedLoginTracker.recordSuccessfulLogin(clientIp);
      await db.update(users).set({
        lastLoginAt: new Date(),
        lastLoginIp: clientIp
      }).where(eq(users.id, user.id));
      
      // Regenerate session to prevent session fixation attacks
      req.session.regenerate((regenerateErr) => {
        if (regenerateErr) {
          console.error("Session regeneration error:", regenerateErr);
          return res.status(500).json({ error: "Verification failed" });
        }

        req.session.userId = user.id;
        req.session.mfaPending = false;
        req.session.tempUserId = undefined;

        req.session.save((saveErr) => {
          if (saveErr) {
            console.error("Session save error:", saveErr);
            return res.status(500).json({ error: "Verification failed" });
          }
          
          securityLogger.info("MFA verification successful", { userId: user.id });
          
          res.json({ 
            success: true,
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              mfaEnabled: user.mfaEnabled,
              mustChangePassword: user.mustChangePassword,
              subscriptionTier: user.subscriptionTier,
              isAdmin: user.isAdmin
            }
          });
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid code format" });
      }
      console.error("MFA verification error:", error);
      res.status(500).json({ error: "Verification failed" });
    }
  });
  
  // Get current user
  app.get("/api/auth/user", isAuthenticated, async (req, res) => {
    const user = (req as any).user;
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      mfaEnabled: user.mfaEnabled,
      mustChangePassword: user.mustChangePassword,
      subscriptionTier: user.subscriptionTier,
      isAdmin: user.isAdmin,
      emailVerified: user.emailVerified
    });
  });
  
  // Logout
  app.post("/api/auth/logout", (req, res) => {
    const userId = req.session?.userId;
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      if (userId) {
        securityLogger.info("User logged out", { userId });
      }
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });
  
  // Request password reset with OTP
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = passwordResetRequestSchema.parse(req.body);
      
      const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
      
      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({ success: true, message: "If an account exists, a verification code has been sent" });
      }
      
      // Generate 6-digit OTP
      const otpCode = generateOTP();
      const resetExpires = new Date();
      resetExpires.setMinutes(resetExpires.getMinutes() + 15); // 15 minute expiry for OTP
      
      await db.update(users).set({
        passwordResetToken: otpCode,
        passwordResetExpires: resetExpires
      }).where(eq(users.id, user.id));
      
      securityLogger.info("Password reset OTP requested", { userId: user.id });
      
      // TODO: Send OTP via email in production
      // For development, log the OTP
      console.log(`[OTP] Password reset code for ${email}: ${otpCode}`);
      
      res.json({ success: true, message: "If an account exists, a verification code has been sent to your email" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid email" });
      }
      console.error("Forgot password error:", error);
      res.status(500).json({ error: "Request failed" });
    }
  });
  
  // Verify OTP code
  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { email, code } = req.body;
      
      if (!email || !code) {
        return res.status(400).json({ error: "Email and code are required" });
      }
      
      const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
      
      if (!user || !user.passwordResetToken || !user.passwordResetExpires) {
        return res.status(400).json({ error: "Invalid or expired code" });
      }
      
      // Check expiry
      if (new Date(user.passwordResetExpires) < new Date()) {
        return res.status(400).json({ error: "Code has expired. Please request a new one." });
      }
      
      // Verify code with timing-safe comparison
      try {
        const tokenBuffer = Buffer.from(user.passwordResetToken, 'utf8');
        const codeBuffer = Buffer.from(String(code), 'utf8');
        if (tokenBuffer.length !== codeBuffer.length || !crypto.timingSafeEqual(tokenBuffer, codeBuffer)) {
          return res.status(400).json({ error: "Invalid code" });
        }
      } catch {
        return res.status(400).json({ error: "Invalid code" });
      }
      
      // Generate a temporary reset token for the password reset step
      const resetToken = generateToken();
      const tokenExpires = new Date();
      tokenExpires.setMinutes(tokenExpires.getMinutes() + 10); // 10 minutes to complete reset
      
      await db.update(users).set({
        passwordResetToken: resetToken,
        passwordResetExpires: tokenExpires
      }).where(eq(users.id, user.id));
      
      securityLogger.info("OTP verified for password reset", { userId: user.id });
      
      res.json({ success: true, resetToken });
    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({ error: "Verification failed" });
    }
  });
  
  // Reset password with token (after OTP verification)
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, password } = passwordResetSchema.parse(req.body);
      
      const [user] = await db.select().from(users).where(eq(users.passwordResetToken, token));
      
      if (!user || !user.passwordResetExpires || new Date(user.passwordResetExpires) < new Date()) {
        return res.status(400).json({ error: "Invalid or expired reset session. Please start over." });
      }
      
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      
      await db.update(users).set({
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
        mustChangePassword: false,
        failedLoginAttempts: "0",
        lockedUntil: null,
        updatedAt: new Date()
      }).where(eq(users.id, user.id));
      
      securityLogger.info("Password reset completed", { userId: user.id });
      
      res.json({ success: true, message: "Password has been reset successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Reset password error:", error);
      res.status(500).json({ error: "Password reset failed" });
    }
  });
  
  // Change password (authenticated)
  app.post("/api/auth/change-password", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
      
      // Verify current password
      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      
      const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
      
      await db.update(users).set({
        passwordHash,
        mustChangePassword: false,
        updatedAt: new Date()
      }).where(eq(users.id, user.id));
      
      securityLogger.info("Password changed", { userId: user.id });
      
      res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Change password error:", error);
      res.status(500).json({ error: "Password change failed" });
    }
  });
  
  // Enable MFA - Generate secret and QR code
  app.post("/api/auth/mfa/enable", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      
      if (user.mfaEnabled) {
        return res.status(400).json({ error: "MFA is already enabled" });
      }
      
      // Generate secret
      const secret = speakeasy.generateSecret({
        name: `GetCyberRight (${user.email})`,
        issuer: "GetCyberRight"
      });
      
      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);
      
      // Store secret temporarily (not enabled yet)
      await db.update(users).set({
        mfaSecret: secret.base32
      }).where(eq(users.id, user.id));
      
      res.json({
        success: true,
        secret: secret.base32,
        qrCode: qrCodeUrl,
        message: "Scan the QR code with your authenticator app, then verify with a code"
      });
    } catch (error) {
      console.error("MFA enable error:", error);
      res.status(500).json({ error: "Failed to enable MFA" });
    }
  });
  
  // Verify and complete MFA setup
  app.post("/api/auth/mfa/verify-setup", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      const { code } = mfaVerifySchema.parse(req.body);
      
      if (!user.mfaSecret) {
        return res.status(400).json({ error: "MFA setup not initiated" });
      }
      
      // Verify the code
      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: "base32",
        token: code,
        window: 1
      });
      
      if (!verified) {
        return res.status(400).json({ error: "Invalid verification code" });
      }
      
      // Generate backup codes
      const backupCodes = Array.from({ length: 10 }, () => 
        crypto.randomBytes(4).toString("hex").toUpperCase()
      );
      
      // Enable MFA
      await db.update(users).set({
        mfaEnabled: true,
        mfaBackupCodes: JSON.stringify(backupCodes),
        updatedAt: new Date()
      }).where(eq(users.id, user.id));
      
      securityLogger.info("MFA enabled", { userId: user.id });
      
      res.json({
        success: true,
        backupCodes,
        message: "MFA has been enabled. Save these backup codes securely."
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid code format" });
      }
      console.error("MFA verify setup error:", error);
      res.status(500).json({ error: "Failed to verify MFA setup" });
    }
  });
  
  // Disable MFA
  app.post("/api/auth/mfa/disable", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      const { code } = mfaVerifySchema.parse(req.body);
      
      if (!user.mfaEnabled || !user.mfaSecret) {
        return res.status(400).json({ error: "MFA is not enabled" });
      }
      
      // Verify the code before disabling
      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: "base32",
        token: code,
        window: 1
      });
      
      if (!verified) {
        return res.status(400).json({ error: "Invalid verification code" });
      }
      
      // Disable MFA
      await db.update(users).set({
        mfaEnabled: false,
        mfaSecret: null,
        mfaBackupCodes: null,
        updatedAt: new Date()
      }).where(eq(users.id, user.id));
      
      securityLogger.info("MFA disabled", { userId: user.id });
      
      res.json({ success: true, message: "MFA has been disabled" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid code format" });
      }
      console.error("MFA disable error:", error);
      res.status(500).json({ error: "Failed to disable MFA" });
    }
  });
  
  // Get new backup codes
  app.post("/api/auth/mfa/regenerate-backup-codes", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      const { code } = mfaVerifySchema.parse(req.body);
      
      if (!user.mfaEnabled || !user.mfaSecret) {
        return res.status(400).json({ error: "MFA is not enabled" });
      }
      
      // Verify the code
      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: "base32",
        token: code,
        window: 1
      });
      
      if (!verified) {
        return res.status(400).json({ error: "Invalid verification code" });
      }
      
      // Generate new backup codes
      const backupCodes = Array.from({ length: 10 }, () => 
        crypto.randomBytes(4).toString("hex").toUpperCase()
      );
      
      await db.update(users).set({
        mfaBackupCodes: JSON.stringify(backupCodes),
        updatedAt: new Date()
      }).where(eq(users.id, user.id));
      
      securityLogger.info("MFA backup codes regenerated", { userId: user.id });
      
      res.json({
        success: true,
        backupCodes,
        message: "New backup codes generated. Save them securely."
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid code format" });
      }
      console.error("Regenerate backup codes error:", error);
      res.status(500).json({ error: "Failed to regenerate backup codes" });
    }
  });
  
  // Verify email
  app.get("/api/auth/verify-email/:token", async (req, res) => {
    try {
      const { token } = req.params;
      
      const [user] = await db.select().from(users).where(eq(users.emailVerificationToken, token));
      
      if (!user || !user.emailVerificationExpires || new Date(user.emailVerificationExpires) < new Date()) {
        return res.status(400).json({ error: "Invalid or expired verification token" });
      }
      
      await db.update(users).set({
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        updatedAt: new Date()
      }).where(eq(users.id, user.id));
      
      securityLogger.info("Email verified", { userId: user.id });
      
      res.json({ success: true, message: "Email verified successfully" });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ error: "Verification failed" });
    }
  });
}

export { isAuthenticated as authMiddleware };

// Admin-only middleware - must be used after isAuthenticated
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user?.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Seed admin user from environment variables on startup
export async function seedAdminUser(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log("[auth] No ADMIN_EMAIL/ADMIN_PASSWORD set, skipping admin seed");
    return;
  }

  try {
    const targetEmail = "judekwekuannan@gmail.com";
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    // Ensure the target admin account exists, is unlocked, and password is synced
    const existing = await db.select().from(users).where(eq(users.email, targetEmail));
    if (existing.length > 0) {
      await db.update(users).set({
        isAdmin: true,
        passwordHash,
        failedLoginAttempts: "0",
        lockedUntil: null,
        emailVerified: true,
      }).where(eq(users.email, targetEmail));
      console.log(`[auth] Admin user ${targetEmail} synced`);
    } else {
      await db.insert(users).values({
        email: targetEmail,
        passwordHash,
        firstName: "Admin",
        lastName: "User",
        isAdmin: true,
        emailVerified: true,
        subscriptionTier: "enterprise",
      });
      console.log(`[auth] Created admin user: ${targetEmail}`);
    }
  } catch (error) {
    console.error("[auth] Failed to seed admin user:", error);
  }
}
