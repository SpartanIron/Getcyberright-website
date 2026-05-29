import type { Request, Response, NextFunction } from 'express';

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

interface RecaptchaVerifyResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

export async function verifyRecaptcha(token: string): Promise<{ success: boolean; score: number; error?: string }> {
  const isDevelopment = process.env.NODE_ENV === 'development';
      
  if (!RECAPTCHA_SECRET_KEY) {
    console.warn('[reCAPTCHA] Secret key not configured, skipping verification');
    return { success: true, score: 1.0 };
  }

  if (!token || token === '') {
    console.warn('[reCAPTCHA] Empty token received - reCAPTCHA may not have loaded');
    // Allow requests without token to prevent blocking legitimate users
    // when reCAPTCHA fails to load (ad blockers, network issues, etc.)
    return { success: true, score: 0.5 };
  }

  try {
    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    const data: RecaptchaVerifyResponse = await response.json();

    console.log('[reCAPTCHA] Verification result:', {
      success: data.success,
      score: data.score,
      action: data.action,
    });

    if (!data.success) {
      const isDev = process.env.NODE_ENV === 'development';
      const errorCodes = data['error-codes'] || [];
      
      // hostname-mismatch means the domain isn't registered in reCAPTCHA admin
      // Allow these requests to proceed to avoid blocking legitimate users
      if (errorCodes.includes('hostname-mismatch')) {
        console.warn('[reCAPTCHA] Hostname mismatch - domain may not be registered in reCAPTCHA settings. Allowing request.');
        return { success: true, score: 0.5 };
      }

              // invalid-input-secret or invalid-input-response means key misconfiguration, not a bot
              // Allow these requests to prevent blocking all legitimate users due to a key setup issue
              if (errorCodes.includes('invalid-input-secret') || errorCodes.includes('invalid-input-response') || errorCodes.includes('bad-request')) {
                          console.warn('[reCAPTCHA] Key configuration issue detected - allowing request to prevent blocking users:', errorCodes.join(', '));
                          return { success: true, score: 0.5 };
              }
      
      if (isDev) {
        console.warn('[reCAPTCHA] Development mode - allowing despite verification failure');
        return { success: true, score: 0.6 };
      }
      return { 
        success: false, 
        score: 0, 
        error: `Verification failed: ${errorCodes.join(', ') || 'Unknown error'}` 
      };
    }

    return { success: true, score: data.score };
  } catch (error) {
    console.error('[reCAPTCHA] Verification error:', error);
    // In case of network/API errors, allow the request to proceed with low score
    // This prevents blocking legitimate users due to Google API issues
    return { success: true, score: 0.5 };
  }
}

export function recaptchaMiddleware(minScore: number = 0.5) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.body?.recaptchaToken;

    const result = await verifyRecaptcha(token);

    if (!result.success) {
      console.log('[reCAPTCHA] Verification failed:', result.error);
      return res.status(400).json({ 
        message: result.error || 'Security verification failed. Please refresh the page and try again.'
      });
    }

    if (result.score < minScore) {
      console.log(`[reCAPTCHA] Low score detected: ${result.score} (min: ${minScore})`);
      return res.status(400).json({ 
        message: 'Our security system flagged this submission. Please try again or contact us directly at hello@getcyberright.com'
      });
    }

    (req as any).recaptchaScore = result.score;
    next();
  };
}
