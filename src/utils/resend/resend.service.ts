import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { Job, User } from '@prisma/client';

@Injectable()
export class ResendService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendVerificationEmail(name: string, to: string, token: string) {
    const confirmLink = `${process.env.FRONTEND_URL}/auth/new-verification?token=${token}`;

    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: 'Confirm your email',
      html: `
        <div>
          <h2>Hello, ${name}</h2>
          <p>Click <a href="${confirmLink}">here</a> to confirm your email or copy and paste the link in your browser.</p>
          <p>${confirmLink}</p>
          <p>Link is valid for 60 minutes.</p>
          <p>Best regards!</p>
        </div>
      `,
    });
  }

  async sendPasswordResetMail(to: string, token: string, user: User) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const mailOptions = {
      from: 'onboarding@resend.dev',
      to,
      subject: 'Password reset request',
      html: `
        <h2>Hello, ${user.name},</h2>
        <p>Click <a href="${resetLink}">Reset Password</a> or copy and paste the link in your browser to reset your password.</p>
        <p>${resetLink}</p>
        <p>This link is valid for the next 1 hour.</p>
        <p>Best regards,</p>
      `,
    };

    await this.resend.emails.send(mailOptions);
  }
}
