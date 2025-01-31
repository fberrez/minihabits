import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { SubscriptionTier } from 'src/users/users.schema';

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
        <p>If you have any questions, please reply to this email.</p>
        <p>Thank you for using <a href="${process.env.FRONTEND_URL}">minihabits</a>!</p>
        <p>The minihabits team</p>
      `,
    });
  }

  async sendWelcomeEmail(email: string) {
    return this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Welcome to minihabits!',
      html: `
        <p>Welcome to <a href="${process.env.FRONTEND_URL}">minihabits</a>!</p>
        <p>We're excited to have you on board. Start building your habits today!</p>
        <p>If you have any questions, please reply to this email.</p>
        <p>Thank you for using <a href="${process.env.FRONTEND_URL}">minihabits</a>!</p>
        <p>The minihabits team</p>
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
        <p>If you didn't make this change, please contact support immediately by replying to this email.</p>
        <p>Thank you for using <a href="${process.env.FRONTEND_URL}">minihabits</a>!</p>
        <p>The minihabits team</p>
      `,
      }),
      this.resend.emails.send({
        from: this.from,
        to: newEmail,
        subject: 'Email Address Changed',
        html: `
        <p>Hello,</p>
        <p>Your email address has been changed from ${oldEmail} to ${newEmail}.</p>
        <p>If you didn't make this change, please contact support immediately by replying to this email.</p>
        <p>Thank you for using <a href="${process.env.FRONTEND_URL}">minihabits</a>!</p>
        <p>The minihabits team</p>
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
        <p>If you have any questions, please reply to this email.</p>
        <p>Thank you for using <a href="${process.env.FRONTEND_URL}">minihabits</a>!</p>
        <p>The minihabits team</p>
      `,
    });
  }

  async sendSubscriptionActivated(email: string, tier: SubscriptionTier) {
    return this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Subscription Activated',
      html: `
        <p>Hello,</p>
        <p>Your ${tier} subscription has been successfully activated.</p>
        <p>If you have any questions, please reply to this email.</p>
        <p>Thank you for using <a href="${process.env.FRONTEND_URL}">minihabits</a>!</p>
        <p>The minihabits team</p>
      `,
    });
  }

  async sendSubscriptionCancelled(email: string, expirationDate: Date) {
    return this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Subscription Cancelled',
      html: `
        <p>Hello,</p>
        <p>Your subscription has been cancelled. It will expire on ${expirationDate.toLocaleDateString()}.</p>
        <p>You can still use <a href="${process.env.FRONTEND_URL}">minihabits</a> with our free plan.</p>
        <p>If you have any questions, please reply to this email.</p>
        <p>Thank you for using <a href="${process.env.FRONTEND_URL}">minihabits</a>!</p>
        <p>The minihabits team</p>
      `,
    });
  }

  async sendPaymentFailed(email: string) {
    return this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Payment Failed',
      html: `
        <p>Hello,</p>
        <p>We were unable to process your payment for <a href="${process.env.FRONTEND_URL}">minihabits</a>.</p>
        <p>Please update your payment information to continue using your subscription.</p>
        <p>If you have any questions, please reply to this email.</p>
        <p>Thank you for using <a href="${process.env.FRONTEND_URL}">minihabits</a>!</p>
        <p>The minihabits team</p>
      `,
    });
  }

  async sendPaymentSucceeded(email: string) {
    return this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Payment Succeeded',
      html: `
        <p>Hello,</p>
        <p>Your payment has been successfully processed.</p>
        <p>If you have any questions, please reply to this email.</p>
        <p>Thank you for using <a href="${process.env.FRONTEND_URL}">minihabits</a>!</p>
        <p>The minihabits team</p>
      `,
    });
  }
}
