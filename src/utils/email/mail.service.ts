import { Injectable } from '@nestjs/common';
import { Job, User } from '@prisma/client';
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

  async sendPasswordResetMail(to: string, token: string, user: User) {
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

  async sendCreateApplicationMail(
    to: string,
    name: string,
    job: Job,
    status: string,
    applicationId: string,
  ) {
    const applicationLink = `${process.env.FRONTEND_URL}/applications/?applicationId=${applicationId}`;
    const mailOptions = {
      from: 'Job Application Service',
      to,
      subject: `New application for ${job.title}`,
      html: `
        <h2>Hello ${name},</h2>
        <p>You have a new application for the position of ${job.title} at ${job.company}.</p>
        <p><strong>New Status:</strong> ${status}</p>
        <p>Click the link to view the application and update the status.</p>
        <p><a href="${applicationLink}">View application</a></p>
        <p>Best regards,</p>
        <p>The Job Application Team</p>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Status change email sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending status change email:', error);
      throw error;
    }
  }

  async sendApplicationStatusMail(
    to: string,
    name: string,
    job: Job,
    status: string,
    applicationId: string,
  ) {
    const applicationLink = `${process.env.FRONTEND_URL}/applications/?applicationId=${applicationId}`;
    const mailOptions = {
      from: 'Job Application Service',
      to,
      subject: `Application Status Update for ${job.title}`,
      html: `
        <h2>Hello ${name},</h2>
        <p>We wanted to inform you that the status of your application for the position of ${job.title} at ${job.company} has been updated.</p>
        <p><strong>New Status:</strong> ${status}</p>
        <p>Click the link to view your application.</p>
        <p><a href="${applicationLink}">View application</a></p>
        <p>Best regards,</p>
        <p>The Job Application Team</p>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Status change email sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending status change email:', error);
      throw error;
    }
  }
}
