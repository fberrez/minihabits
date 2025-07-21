import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;
  private from: string;
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.from = process.env.RESEND_FROM;
  }

  async sendPasswordReset(email: string, resetToken: string) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    return this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <p>Hello,</p>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }

  async sendWelcomeEmail(email: string) {
    await this.createContact(email);
    return this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Welcome to MiniHabits!',
      html: `
        <p>Welcome to MiniHabits!</p>
        <p>We're excited to have you on board. Start building your habits today!</p>
      `,
    });
  }

  async sendEmailChangeConfirmation(oldEmail: string, newEmail: string) {
    await Promise.all([
      this.resend.emails.send({
        from: this.from,
        to: oldEmail,
        subject: 'Email Address Changed',
        html: `
        <p>Hello,</p>
        <p>Your email address has been changed from ${oldEmail} to ${newEmail}.</p>
        <p>If you didn't make this change, please contact support immediately.</p>
      `,
      }),
      this.resend.emails.send({
        from: this.from,
        to: newEmail,
        subject: 'Email Address Changed',
        html: `
        <p>Hello,</p>
        <p>Your email address has been changed from ${oldEmail} to ${newEmail}.</p>
        <p>If you didn't make this change, please contact support immediately.</p>
      `,
      }),
    ]);
  }

  async sendAccountDeletionConfirmation(email: string) {
    return this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Account Deleted',
      html: `
        <p>Hello,</p>
        <p>Your MiniHabits account has been successfully deleted.</p>
        <p>We're sorry to see you go. If you change your mind, you can always create a new account.</p>
      `,
    });
  }

  async sendSubscriptionWelcome(email: string, tier: string) {
    const tierDisplayNames = {
      monthly: 'Monthly Pro',
      yearly: 'Yearly Pro',
      lifetime: 'Lifetime'
    };
    
    const tierName = tierDisplayNames[tier] || tier;

    return this.resend.emails.send({
      from: this.from,
      to: email,
      subject: `Welcome to ${tierName}! 🎉`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4f46e5;">Welcome to ${tierName}!</h1>
          <p>Congratulations! Your subscription has been activated successfully.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">What's included in your plan:</h3>
            <ul>
              <li>✅ Unlimited habits</li>
              <li>✅ Advanced statistics and insights</li>
              <li>✅ Data export functionality</li>
              <li>✅ Premium support</li>
              ${tier === 'lifetime' ? '<li>✅ Lifetime access to all features</li>' : ''}
            </ul>
          </div>

          <p>Start creating unlimited habits and track your progress with advanced analytics!</p>
          
          <p style="margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Go to Dashboard
            </a>
          </p>

          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            Need help? Reply to this email or contact us at support@minihabits.com
          </p>
        </div>
      `,
    });
  }

  async sendSubscriptionCancelled(email: string, tier: string, endDate: Date) {
    const tierDisplayNames = {
      monthly: 'Monthly Pro',
      yearly: 'Yearly Pro',
      lifetime: 'Lifetime'
    };
    
    const tierName = tierDisplayNames[tier] || tier;

    return this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Subscription Cancelled - Access Continues',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Subscription Cancelled</h1>
          <p>We're sorry to see you go! Your ${tierName} subscription has been cancelled.</p>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="margin-top: 0; color: #92400e;">Important Information</h3>
            <p style="margin-bottom: 0;">You'll continue to have access to all premium features until <strong>${endDate.toLocaleDateString()}</strong>.</p>
          </div>

          <p>After this date, your account will automatically switch to the free tier with up to 3 habits.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">What happens next:</h3>
            <ul>
              <li>Your data remains safe and secure</li>
              <li>You can reactivate anytime</li>
              <li>Free tier includes up to 3 habits</li>
              <li>All existing habits are preserved</li>
            </ul>
          </div>

          <p>Changed your mind? You can reactivate your subscription anytime.</p>
          
          <p style="margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/pricing" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Reactivate Subscription
            </a>
          </p>

          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            We'd love to hear your feedback. Reply to this email and let us know how we can improve.
          </p>
        </div>
      `,
    });
  }

  async sendPaymentFailed(email: string, tier: string) {
    const tierDisplayNames = {
      monthly: 'Monthly Pro',
      yearly: 'Yearly Pro',
      lifetime: 'Lifetime'
    };
    
    const tierName = tierDisplayNames[tier] || tier;

    return this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Payment Failed - Action Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Payment Failed</h1>
          <p>We were unable to process the payment for your ${tierName} subscription.</p>
          
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="margin-top: 0; color: #991b1b;">Action Required</h3>
            <p style="margin-bottom: 0;">Please update your payment method to continue enjoying premium features.</p>
          </div>

          <p>Your subscription will be suspended if payment is not received within 3 days.</p>
          
          <p style="margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/account" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Update Payment Method
            </a>
          </p>

          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            Need help? Contact us at support@minihabits.com
          </p>
        </div>
      `,
    });
  }

  async createContact(email: string) {
    try {
      await this.resend.contacts.create({
        email,
        unsubscribed: false,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
