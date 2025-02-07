import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { Company, Job, User } from '@prisma/client';

@Injectable()
export class ResendService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendUpdateCompanyUpdateRejectionEmailToCompany(
    company: Company,
    companyStatus: string,
  ) {
    const mailOptions = {
      from: 'onboarding@resend.dev',
      to: company.notificationEmail,
      subject: 'Company application update',
      html: `
        <p>${company.companyName}, your company application status has been updated.</p>
        <p>Application status is ${companyStatus}. You can resubmit your details. Ensure your CAC document is authentic.</p>
        <p>Best regards!</p>
      `,
    };

    await this.resend.emails.send(mailOptions);
  }

  async sendUpdateCompanyUpdateApprovalEmailToCompany(
    company: Company,
    companyStatus: string,
  ) {
    const mailOptions = {
      from: 'onboarding@resend.dev',
      to: company.notificationEmail,
      subject: 'Company application update',
      html: `
        <p>${company.companyName}, your company application status has been updated.</p>
        <p>Application status is ${companyStatus}. You can now create jobs for job seekers!</p>
        <p>Best regards!</p>
      `,
    };

    await this.resend.emails.send(mailOptions);
  }

  async sendCreateCompanyEmailToAdmin(to: string, company: Company) {
    const mailOptions = {
      from: 'onboarding@resend.dev',
      to,
      subject: 'Create company application',
      html: `
        <p>${company.companyName} has successfully submitted her application to create a company with Jobstack.</p>
        <p>Application status is PENDING. Kindly review their application and update their application status accordingly.</p>
        <p>Best regards!</p>
      `,
    };

    await this.resend.emails.send(mailOptions);
  }

  async sendCreateCompanyEmailToCompany(company: Company) {
    const mailOptions = {
      from: 'onboarding@resend.dev',
      to: company.notificationEmail,
      subject: 'Create company application',
      html: `
        <h2>Hello, ${company.companyName},</h2>
        <p>You successfully submitted your application to create a company with Jobstack.</p>
        <p>Your application status is PENDING, you'll be notified once the application status changes (before 24 hours).</p>
        <p>Best regards!</p>
      `,
    };

    await this.resend.emails.send(mailOptions);
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
        <p>Best regards!</p>
      `,
    };

    await this.resend.emails.send(mailOptions);
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
}
