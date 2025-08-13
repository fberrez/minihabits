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

  async sendPasswordChanged(email: string) {
    return this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Your MiniHabits password was changed',
      html: `
        <p>Hello,</p>
        <p>This is a confirmation that your password was successfully changed.</p>
        <p>If you did not perform this change, please contact support immediately.</p>
      `,
    });
  }

  async sendPasswordResetSuccessful(email: string) {
    return this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Your MiniHabits password has been reset',
      html: `
        <p>Hello,</p>
        <p>Your password was successfully reset. If this wasn't you, contact support immediately.</p>
      `,
    });
  }

  async sendSubscriptionActivated(email: string, planName: string) {
    return this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Premium activated – Welcome to MiniHabits Premium',
      html: `
        <p>Hello,</p>
        <p>Your subscription (<strong>${planName}</strong>) is now active. Enjoy Premium features!</p>
      `,
    });
  }

  async sendSubscriptionRenewed(
    email: string,
    planName: string,
    nextRenewalDate?: Date | null,
  ) {
    const suffix = nextRenewalDate
      ? ` Your next renewal date is ${nextRenewalDate.toLocaleDateString()}.`
      : '';
    return this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Subscription renewed',
      html: `
        <p>Hello,</p>
        <p>Your subscription (<strong>${planName}</strong>) has been renewed.${suffix}</p>
      `,
    });
  }

  async sendSubscriptionCancellationScheduled(
    email: string,
    periodEnd?: Date | null,
  ) {
    const suffix = periodEnd
      ? ` It will remain active until ${periodEnd.toLocaleDateString()}.`
      : '';
    return this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Subscription cancellation scheduled',
      html: `
        <p>Hello,</p>
        <p>Your subscription will be canceled at the end of the current period.${suffix}</p>
      `,
    });
  }

  async sendSubscriptionExpired(email: string) {
    return this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Subscription expired',
      html: `
        <p>Hello,</p>
        <p>Your subscription has expired. You can re-subscribe anytime from the Pricing page.</p>
      `,
    });
  }
}
