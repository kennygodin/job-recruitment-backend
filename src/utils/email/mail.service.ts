import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });
  }

  async sendPasswordResetMail(to: string, token: string, user) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const mailOptions = {
      from: 'Auth Backend Service',
      to,
      subject: 'Password Reset Request',
      html: `
        <h2>Hello ${user.name},</h2>
        <p>We received a request to reset your password. Please click the link below or copy and paste it into your browser to reset your password:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>This link is valid for the next 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email or contact our support if you have any concerns.</p>
        <p>Best regards,</p>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
