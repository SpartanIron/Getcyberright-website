import type { Express, Request, Response } from 'express';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import { authenticateToken, generateToken, type AuthenticatedRequest } from './security/auth';
import { storage } from './storage';

const RP_NAME = 'GetCyberRight';
const RP_ID = process.env.REPLIT_DEV_DOMAIN?.replace(/:\d+$/, '') || 'localhost';
const ORIGIN = process.env.REPLIT_DEV_DOMAIN 
  ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
  : 'http://localhost:5000';

export function registerWebAuthnRoutes(app: Express) {
  app.get('/api/auth/passkey/credentials', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const credentials = await storage.getWebauthnCredentialsByUserId(req.user!.id);
      res.json(credentials.map(c => ({
        id: c.id,
        deviceName: c.deviceName || 'Security Key',
        createdAt: c.createdAt,
        lastUsed: c.lastUsed,
        credentialBackedUp: c.credentialBackedUp,
      })));
    } catch (error) {
      console.error('Get passkeys error:', error);
      res.status(500).json({ message: 'Failed to get passkeys' });
    }
  });

  app.post('/api/auth/passkey/register/options', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const existingCredentials = await storage.getWebauthnCredentialsByUserId(user.id);

      const userIdBytes = new TextEncoder().encode(user.id.toString());
      const options = await generateRegistrationOptions({
        rpName: RP_NAME,
        rpID: RP_ID,
        userID: userIdBytes,
        userName: user.email,
        userDisplayName: user.email,
        attestationType: 'none',
        excludeCredentials: existingCredentials.map(cred => ({
          id: cred.credentialId,
          transports: cred.transports ? JSON.parse(cred.transports) : undefined,
        })),
        authenticatorSelection: {
          residentKey: 'preferred',
          userVerification: 'preferred',
        },
      });

      await storage.cleanupExpiredChallenges();
      await storage.createWebauthnChallenge({
        challenge: options.challenge,
        userId: user.id,
        type: 'registration',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });

      res.json(options);
    } catch (error) {
      console.error('Passkey registration options error:', error);
      res.status(500).json({ message: 'Failed to generate registration options' });
    }
  });

  app.post('/api/auth/passkey/register/verify', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { response, deviceName } = req.body as { 
        response: RegistrationResponseJSON; 
        deviceName?: string;
      };

      const user = await storage.getUser(req.user!.id);
      if (!user) {
        await storage.createAuditLog({
          userId: req.user!.id,
          username: 'unknown',
          action: 'PASSKEY_REGISTRATION_FAILED',
          details: 'User not found during passkey registration',
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.headers['user-agent'],
        });
        return res.status(404).json({ message: 'User not found' });
      }

      const pendingChallenges = await storage.getPendingChallengesForUser(user.id, 'registration');
      if (!pendingChallenges || pendingChallenges.length === 0) {
        await storage.createAuditLog({
          userId: user.id,
          username: user.email,
          action: 'PASSKEY_REGISTRATION_FAILED',
          details: 'No pending registration challenge found',
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.headers['user-agent'],
        });
        return res.status(400).json({ message: 'No pending registration challenge. Please start over.' });
      }

      const latestChallenge = pendingChallenges[0];
      
      if (new Date() > latestChallenge.expiresAt) {
        await storage.deleteWebauthnChallenge(latestChallenge.challenge);
        await storage.createAuditLog({
          userId: user.id,
          username: user.email,
          action: 'PASSKEY_REGISTRATION_FAILED',
          details: 'Registration challenge expired',
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.headers['user-agent'],
        });
        return res.status(400).json({ message: 'Challenge expired. Please try again.' });
      }

      let verification;
      try {
        verification = await verifyRegistrationResponse({
          response,
          expectedChallenge: latestChallenge.challenge,
          expectedOrigin: ORIGIN,
          expectedRPID: RP_ID,
        });
      } catch (verifyError: any) {
        await storage.deleteWebauthnChallenge(latestChallenge.challenge);
        await storage.createAuditLog({
          userId: user.id,
          username: user.email,
          action: 'PASSKEY_REGISTRATION_FAILED',
          details: `Verification error: ${verifyError.message}`,
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.headers['user-agent'],
        });
        return res.status(400).json({ message: 'Verification failed' });
      }

      if (!verification.verified || !verification.registrationInfo) {
        await storage.deleteWebauthnChallenge(latestChallenge.challenge);
        await storage.createAuditLog({
          userId: user.id,
          username: user.email,
          action: 'PASSKEY_REGISTRATION_FAILED',
          details: 'Credential verification returned false',
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.headers['user-agent'],
        });
        return res.status(400).json({ message: 'Verification failed' });
      }

      const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;

      await storage.createWebauthnCredential({
        userId: user.id,
        credentialId: credential.id,
        credentialPublicKey: isoBase64URL.fromBuffer(credential.publicKey),
        counter: credential.counter,
        credentialDeviceType,
        credentialBackedUp,
        transports: response.response.transports ? JSON.stringify(response.response.transports) : null,
        deviceName: deviceName || 'Security Key',
      });

      await storage.deleteWebauthnChallenge(latestChallenge.challenge);

      await storage.createAuditLog({
        userId: user.id,
        username: user.email,
        action: 'PASSKEY_REGISTERED',
        details: `Registered new passkey: ${deviceName || 'Security Key'}`,
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
      });

      res.json({ verified: true, message: 'Passkey registered successfully' });
    } catch (error: any) {
      console.error('Passkey registration verify error:', error);
      try {
        await storage.createAuditLog({
          userId: req.user?.id || null,
          username: req.user?.email || 'unknown',
          action: 'PASSKEY_REGISTRATION_FAILED',
          details: `Server error: ${error.message || 'Unknown error'}`,
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.headers['user-agent'],
        });
      } catch (logError) {
        console.error('Failed to create audit log:', logError);
      }
      res.status(500).json({ message: 'Failed to verify registration' });
    }
  });

  app.post('/api/auth/passkey/authenticate/options', async (req: Request, res: Response) => {
    try {
      const { username } = req.body;
      
      let allowCredentials: { id: string; transports?: any }[] | undefined;
      let userId: number | undefined;

      if (username) {
        const user = await storage.getUserByUsername(username);
        if (user) {
          userId = user.id;
          const credentials = await storage.getWebauthnCredentialsByUserId(user.id);
          if (credentials.length > 0) {
            allowCredentials = credentials.map(cred => ({
              id: cred.credentialId,
              transports: cred.transports ? JSON.parse(cred.transports) : undefined,
            }));
          }
        }
      }

      const options = await generateAuthenticationOptions({
        rpID: RP_ID,
        allowCredentials,
        userVerification: 'preferred',
      });

      await storage.cleanupExpiredChallenges();
      await storage.createWebauthnChallenge({
        challenge: options.challenge,
        userId: userId || null,
        type: 'authentication',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });

      res.json(options);
    } catch (error) {
      console.error('Passkey auth options error:', error);
      res.status(500).json({ message: 'Failed to generate authentication options' });
    }
  });

  app.post('/api/auth/passkey/authenticate/verify', async (req: Request, res: Response) => {
    try {
      const { response } = req.body as { 
        response: AuthenticationResponseJSON;
      };

      const credential = await storage.getWebauthnCredentialById(response.id);
      if (!credential) {
        await storage.createAuditLog({
          userId: null,
          username: 'unknown',
          action: 'PASSKEY_AUTH_FAILED',
          details: 'Unknown credential ID',
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.headers['user-agent'],
        });
        return res.status(400).json({ message: 'Unknown credential' });
      }

      const pendingChallenges = await storage.getPendingChallengesForUser(credential.userId, 'authentication');
      if (!pendingChallenges || pendingChallenges.length === 0) {
        await storage.createAuditLog({
          userId: credential.userId,
          username: 'unknown',
          action: 'PASSKEY_AUTH_FAILED',
          details: 'No pending authentication challenge found',
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.headers['user-agent'],
        });
        return res.status(400).json({ message: 'No pending authentication. Please start over.' });
      }

      const latestChallenge = pendingChallenges[0];

      if (new Date() > latestChallenge.expiresAt) {
        await storage.deleteWebauthnChallenge(latestChallenge.challenge);
        await storage.createAuditLog({
          userId: credential.userId,
          username: 'unknown',
          action: 'PASSKEY_AUTH_FAILED',
          details: 'Challenge expired',
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.headers['user-agent'],
        });
        return res.status(400).json({ message: 'Challenge expired' });
      }

      let verification;
      try {
        verification = await verifyAuthenticationResponse({
          response,
          expectedChallenge: latestChallenge.challenge,
          expectedOrigin: ORIGIN,
          expectedRPID: RP_ID,
          credential: {
            id: credential.credentialId,
            publicKey: isoBase64URL.toBuffer(credential.credentialPublicKey),
            counter: credential.counter,
          },
        });
      } catch (verifyError: any) {
        await storage.deleteWebauthnChallenge(latestChallenge.challenge);
        await storage.createAuditLog({
          userId: credential.userId,
          username: 'unknown',
          action: 'PASSKEY_AUTH_FAILED',
          details: `Verification error: ${verifyError.message}`,
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.headers['user-agent'],
        });
        return res.status(400).json({ message: 'Authentication failed' });
      }

      if (!verification.verified) {
        await storage.deleteWebauthnChallenge(latestChallenge.challenge);
        await storage.createAuditLog({
          userId: credential.userId,
          username: 'unknown',
          action: 'PASSKEY_AUTH_FAILED',
          details: 'Verification returned false',
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.headers['user-agent'],
        });
        return res.status(400).json({ message: 'Authentication failed' });
      }

      await storage.updateWebauthnCredentialCounter(
        credential.credentialId,
        verification.authenticationInfo.newCounter
      );

      await storage.deleteWebauthnChallenge(latestChallenge.challenge);

      const user = await storage.getUser(credential.userId);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      const token = generateToken({ id: user.id, username: user.email, role: user.isAdmin ? 'admin' : 'user' });

      await storage.createAuditLog({
        userId: user.id,
        username: user.email,
        action: 'PASSKEY_LOGIN',
        details: 'User logged in with passkey',
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
      });

      res.json({
        verified: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error: any) {
      console.error('Passkey auth verify error:', error);
      try {
        await storage.createAuditLog({
          userId: null,
          username: 'unknown',
          action: 'PASSKEY_AUTH_FAILED',
          details: `Server error: ${error.message || 'Unknown error'}`,
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.headers['user-agent'],
        });
      } catch (logError) {
        console.error('Failed to create audit log:', logError);
      }
      res.status(500).json({ message: 'Authentication failed' });
    }
  });

  app.delete('/api/auth/passkey/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const credentialId = parseInt(req.params.id);
      const credentials = await storage.getWebauthnCredentialsByUserId(req.user!.id);
      
      const credential = credentials.find(c => c.id === credentialId);
      if (!credential) {
        return res.status(404).json({ message: 'Passkey not found' });
      }

      await storage.deleteWebauthnCredential(credentialId);

      await storage.createAuditLog({
        userId: req.user!.id,
        username: req.user!.email || 'unknown',
        action: 'PASSKEY_DELETED',
        details: `Deleted passkey: ${credential.deviceName || 'Security Key'}`,
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
      });

      res.json({ message: 'Passkey deleted successfully' });
    } catch (error) {
      console.error('Delete passkey error:', error);
      res.status(500).json({ message: 'Failed to delete passkey' });
    }
  });
}
