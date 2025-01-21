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
}
