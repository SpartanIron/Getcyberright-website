import { logger } from './logger';

const log = logger.child('EmailService');
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const SMTP2GO_API_URL = 'https://api.smtp2go.com/v3/email/send';
const MAILERSEND_API_URL = 'https://api.mailersend.com/v1/email';
const RESEND_API_URL = 'https://api.resend.com/emails';

interface EmailOptions {
  to: string[];
  subject: string;
  htmlBody: string;
  textBody?: string;
}

type EmailProvider = 'brevo' | 'mailersend' | 'smtp2go' | 'resend' | 'none';

function getConfiguredProvider(): EmailProvider {
  if (process.env.BREVO_API_KEY) return 'brevo';
  if (process.env.MAILERSEND_API_KEY) return 'mailersend';
  if (process.env.SMTP2GO_API_KEY) return 'smtp2go';
  if (process.env.RESEND_API_KEY) return 'resend';
  return 'none';
}

async function sendViaBrevo(options: EmailOptions): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.EMAIL_FROM_ADDRESS || 'tips@getcyberright.com';
  const fromName = process.env.EMAIL_FROM_NAME || 'GetCyberRight';

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey!,
      },
      body: JSON.stringify({
        sender: { email: fromEmail, name: fromName },
        to: options.to.map(email => ({ email })),
        subject: options.subject,
        htmlContent: options.htmlBody,
        textContent: options.textBody || options.htmlBody.replace(/<[^>]*>/g, ''),
      }),
    });

    if (response.ok || response.status === 201) {
      log.info('Email sent successfully via Brevo');
      return true;
    } else {
      const error = await response.text();
      log.error('Brevo failed', { error });
      return false;
    }
  } catch (error) {
    log.error('Brevo error', { error: String(error) });
    return false;
  }
}

export function isEmailConfigured(): boolean {
  return getConfiguredProvider() !== 'none';
}

async function sendViaMailerSend(options: EmailOptions): Promise<boolean> {
  const apiKey = process.env.MAILERSEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM_ADDRESS || 'tips@getcyberright.com';
  const fromName = process.env.EMAIL_FROM_NAME || 'GetCyberRight';

  try {
    const response = await fetch(MAILERSEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: { email: fromEmail, name: fromName },
        to: options.to.map(email => ({ email })),
        subject: options.subject,
        html: options.htmlBody,
        text: options.textBody || options.htmlBody.replace(/<[^>]*>/g, ''),
      }),
    });

    if (response.ok || response.status === 202) {
      log.info('Email sent successfully via MailerSend');
      return true;
    } else {
      const error = await response.text();
      log.error('MailerSend failed', { error });
      return false;
    }
  } catch (error) {
    log.error('MailerSend error', { error: String(error) });
    return false;
  }
}

async function sendViaSMTP2GO(options: EmailOptions): Promise<boolean> {
  const apiKey = process.env.SMTP2GO_API_KEY;

  try {
    const response = await fetch(SMTP2GO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Smtp2go-Api-Key': apiKey!,
        'accept': 'application/json'
      },
      body: JSON.stringify({
        sender: process.env.SMTP2GO_SENDER_EMAIL || 'tips@getcyberright.com',
        to: options.to,
        subject: options.subject,
        html_body: options.htmlBody,
        text_body: options.textBody || options.htmlBody.replace(/<[^>]*>/g, '')
      })
    });

    const result = await response.json();
    
    if (response.ok && result.data?.succeeded > 0) {
      log.info('Email sent successfully via SMTP2GO', { emailId: result.data.email_id });
      return true;
    } else {
      log.error('SMTP2GO failed', { result });
      return false;
    }
  } catch (error) {
    log.error('SMTP2GO error', { error: String(error) });
    return false;
  }
}

async function sendViaResend(options: EmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM_ADDRESS || 'tips@getcyberright.com';
  const fromName = process.env.EMAIL_FROM_NAME || 'GetCyberRight';

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.htmlBody,
        text: options.textBody || options.htmlBody.replace(/<[^>]*>/g, ''),
      }),
    });

    if (response.ok) {
      log.info('Email sent successfully via Resend');
      return true;
    } else {
      const error = await response.text();
      log.error('Resend failed', { error });
      return false;
    }
  } catch (error) {
    log.error('Resend error', { error: String(error) });
    return false;
  }
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const provider = getConfiguredProvider();
  
  if (provider === 'none') {
    log.info('No provider configured, logging email only', {
      to: options.to.join(', '),
      subject: options.subject
    });
    return true;
  }

  if (provider === 'brevo') {
    return sendViaBrevo(options);
  }

  if (provider === 'mailersend') {
    return sendViaMailerSend(options);
  }

  if (provider === 'resend') {
    return sendViaResend(options);
  }
  
  return sendViaSMTP2GO(options);
}

interface DailyTip {
  audience: string;
  title: string;
  tip: string;
}

export function generateDailyTipEmail(tip: DailyTip, subscriberEmail: string, subscriberName?: string): EmailOptions {
  const audienceLabel = tip.audience === 'youth' ? 'Youth Safety' : 
                        tip.audience === 'senior' ? 'Senior Protection' : 'Family Safety';
  
  const audienceEmoji = tip.audience === 'youth' ? '🎮' : 
                        tip.audience === 'senior' ? '🏠' : '👨‍👩‍👧‍👦';
  
  const greeting = subscriberName ? `Hi ${subscriberName},` : 'Hi there,';

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%); padding: 36px 30px; border-radius: 16px 16px 0 0; text-align: center;">
      <img src="https://www.getcyberright.com/lock-logo.png" alt="GetCyberRight" style="width: 70px; height: 70px; border-radius: 14px; margin-bottom: 16px;" />
      <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 700;">GetCyberRight</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 15px;">Digital Safety Tip</p>
    </div>
    
    <!-- Main Content -->
    <div style="background: white; padding: 36px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
      <!-- Personalized Greeting -->
      <p style="color: #334155; font-size: 16px; margin: 0 0 20px; line-height: 1.6;">
        ${greeting} Here's a quick safety tip to help protect you and your family online.
      </p>
      
      <!-- Audience Badge -->
      <div style="display: inline-block; background-color: #f0fdfa; color: #0d9488; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 24px;">
        ${audienceEmoji} ${audienceLabel}
      </div>
      
      <h2 style="color: #0f172a; margin: 0 0 16px; font-size: 22px; font-weight: 700; line-height: 1.3;">${tip.title}</h2>
      
      <p style="color: #475569; line-height: 1.75; font-size: 16px; margin: 0 0 28px;">
        ${tip.tip}
      </p>
      
      <!-- Quick Action Box -->
      <div style="background: #f0f9ff; border-left: 4px solid #0284c7; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 28px;">
        <p style="margin: 0 0 8px; font-size: 14px; color: #0369a1; font-weight: 700; text-transform: uppercase;">💡 Take Action</p>
        <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.6;">Share this tip with a family member or friend who might benefit from it.</p>
      </div>
      
      <!-- CTA Section -->
      <div style="text-align: center; padding-top: 8px;">
        <a href="https://www.getcyberright.com/scam-checker" style="display: inline-block; background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; margin-right: 12px;">
          Check a Scam →
        </a>
        <a href="https://www.getcyberright.com" style="display: inline-block; background: #1e293b; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
          More Tips
        </a>
      </div>
      
      <!-- Social Proof -->
      <div style="margin-top: 28px; padding: 16px 20px; background: #fefce8; border-radius: 8px; text-align: center;">
        <p style="margin: 0; color: #854d0e; font-size: 14px;">
          🛡️ <strong>Join thousands of families</strong> staying safe with GetCyberRight
        </p>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 24px 20px; color: #64748b; font-size: 13px;">
      <p style="margin: 0 0 8px;">You're receiving this because you subscribed to Digital Safety Tips.</p>
      <p style="margin: 0 0 12px;"><a href="https://www.getcyberright.com/unsubscribe?email=${encodeURIComponent(subscriberEmail)}" style="color: #0d9488; text-decoration: underline;">Unsubscribe</a> · <a href="https://www.getcyberright.com/preferences" style="color: #0d9488; text-decoration: underline;">Manage Preferences</a></p>
      <p style="margin: 0; color: #94a3b8;">© ${new Date().getFullYear()} GetCyberRight. Protecting families online.</p>
    </div>
  </div>
</body>
</html>
  `;

  return {
    to: [subscriberEmail],
    subject: `🔒 Digital Safety Tip: ${tip.title}`,
    htmlBody
  };
}

export async function sendDailyTip(tip: DailyTip, subscriberEmail: string): Promise<boolean> {
  const emailOptions = generateDailyTipEmail(tip, subscriberEmail);
  return sendEmail(emailOptions);
}

interface QuizResult {
  score: number;
  maxScore: number;
  level: string;
  recommendations: { title: string; link: string; priority: string }[];
}

export function generateQuizResultsEmail(result: QuizResult, subscriberEmail: string): EmailOptions {
  const percentage = Math.round((result.score / result.maxScore) * 100);
  const levelColor = result.level === 'Excellent' ? '#10b981' :
                     result.level === 'Good' ? '#3b82f6' :
                     result.level === 'Fair' ? '#f59e0b' : '#ef4444';

  const recommendationsHtml = result.recommendations.length > 0 
    ? result.recommendations.map(rec => `
        <div style="display: flex; align-items: center; padding: 12px; margin-bottom: 8px; background: ${rec.priority === 'high' ? '#fef2f2' : '#fffbeb'}; border-radius: 8px; border-left: 4px solid ${rec.priority === 'high' ? '#ef4444' : '#f59e0b'};">
          <span style="color: #1e293b;">${rec.title}</span>
        </div>
      `).join('')
    : '<p style="color: #10b981;">Great job! You have strong cyber safety habits.</p>';

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Your Family Safety Score</h1>
      <p style="color: #94a3b8; margin: 10px 0 0;">GetCyberRight Assessment Results</p>
    </div>
    
    <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="display: inline-flex; align-items: center; justify-content: center; width: 100px; height: 100px; border-radius: 50%; background: ${levelColor}20; margin-bottom: 15px;">
          <span style="font-size: 32px; font-weight: bold; color: ${levelColor};">${percentage}%</span>
        </div>
        <h2 style="color: ${levelColor}; margin: 0; font-size: 24px;">${result.level}</h2>
        <p style="color: #64748b; margin: 10px 0 0;">You scored ${result.score} out of ${result.maxScore} points</p>
      </div>
      
      <h3 style="color: #1e293b; margin: 0 0 15px; font-size: 18px;">Your Personalized Recommendations</h3>
      ${recommendationsHtml}
      
      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 25px; text-align: center;">
        <a href="https://www.getcyberright.com/safety-score" style="display: inline-block; background: linear-gradient(135deg, #0891b2, #10b981); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-right: 10px;">
          Retake Quiz
        </a>
        <a href="https://www.getcyberright.com/resources" style="display: inline-block; background: #1e293b; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Explore Resources
        </a>
      </div>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 12px;">
      <p>Keep improving your family's online safety!</p>
      <p style="margin-top: 10px;">© ${new Date().getFullYear()} GetCyberRight. Protecting families online.</p>
    </div>
  </div>
</body>
</html>
  `;

  return {
    to: [subscriberEmail],
    subject: `Your Family Safety Score: ${percentage}% - ${result.level}`,
    htmlBody
  };
}

export async function sendQuizResults(result: QuizResult, email: string): Promise<boolean> {
  const emailOptions = generateQuizResultsEmail(result, email);
  return sendEmail(emailOptions);
}

export function generateEmailVerificationEmail(email: string, token: string, baseUrl: string): EmailOptions {
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;
  
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 32px 40px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">GetCyberRight</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Keeping Families Safe Online</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 20px;">Verify Your Email Address</h2>
              <p style="color: #4b5563; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">
                Thank you for creating an account with GetCyberRight. Please click the button below to verify your email address and activate your account.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="text-align: center; padding: 24px 0;">
                    <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color: #6b7280; margin: 24px 0 0 0; font-size: 14px; line-height: 1.6;">
                If the button does not work, copy and paste this link into your browser:
              </p>
              <p style="color: #3b82f6; margin: 8px 0 0 0; font-size: 14px; word-break: break-all;">
                ${verificationUrl}
              </p>
              <p style="color: #6b7280; margin: 24px 0 0 0; font-size: 14px; line-height: 1.6;">
                This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                GetCyberRight - Free cybersecurity resources for families
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    to: [email],
    subject: 'Verify Your Email - GetCyberRight',
    htmlBody
  };
}

export async function sendEmailVerification(email: string, token: string, baseUrl: string): Promise<boolean> {
  const emailOptions = generateEmailVerificationEmail(email, token, baseUrl);
  return sendEmail(emailOptions);
}
