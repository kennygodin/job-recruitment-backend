import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Company, User } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendApplicationAcceptedEmail(
    email: string,
    name: string,
    jobTitle: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Application accepted',
      html: `
        <h2>Hello, ${name},</h2>
        <p>Congratulations! Your application for the position of <strong>${jobTitle}</strong> has been <strong>accepted</strong>.</p>
        <p>The company will contact you for the next steps!</p>
        <p>Best regards!</p>
      `,
    });
  }

  async sendApplicationRejectedEmail(
    email: string,
    name: string,
    jobTitle: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Application rejected',
      html: `
        <h2>Hello, ${name},</h2>
        <p>We regret to inform you that your application for the position of <strong>${jobTitle}</strong> has been <strong>rejected</strong>!</p>
        <p>We encourage you to keep applying for other opportunities.</p>
        <p>Best regards!</p>
      `,
    });
  }

  async applicationMailToCompany(
    companyEmail: string,
    companyName: string,
    jobTitle: string,
    applicantName: string,
  ) {
    await this.mailerService.sendMail({
      to: companyEmail,
      subject: `New job application for ${jobTitle}`,
      html: `
        <h3>Hello, ${companyName},</h3>
        <p>You have received a new job application for <strong>${jobTitle}</strong>.</p>
        <p>Applicant: <strong>${applicantName}</strong></p>
        <p>Please review the application in your dashboard!</p>
        <p>Best regards,<br>Jobstack Team</p>
      `,
    });
  }

  async sendUpdateCompanyRejectionEmail(
    company: Company,
    companyStatus: string,
  ) {
    await this.mailerService.sendMail({
      to: company.notificationEmail,
      subject: 'Company application update',
      html: `
        <p>${company.companyName}, your company application status has been updated.</p>
        <p>Application status is ${companyStatus}. You can resubmit your details. Ensure your CAC document is authentic.</p>
        <p>Best regards!</p>
      `,
    });
  }

  async sendUpdateCompanyApprovalEmail(
    company: Company,
    companyStatus: string,
  ) {
    await this.mailerService.sendMail({
      to: company.notificationEmail,
      subject: 'Company application update',
      html: `
        <p>${company.companyName}, your company application status has been updated.</p>
        <p>Application status is ${companyStatus}. You can now create jobs for job seekers!</p>
        <p>Best regards!</p>
      `,
    });
  }

  async sendCreateCompanyEmailToAdmin(to: string, company: Company) {
    await this.mailerService.sendMail({
      to,
      subject: 'Create company application',
      html: `
        <p>${company.companyName} has successfully submitted an application to create a company with Jobstack.</p>
        <p>Application status is PENDING. Kindly review and update accordingly.</p>
        <p>Best regards!</p>
      `,
    });
  }

  async sendCreateCompanyEmailToCompany(company: Company) {
    await this.mailerService.sendMail({
      to: company.notificationEmail,
      subject: 'Create company application',
      html: `
        <h2>Hello, ${company.companyName},</h2>
        <p>You successfully submitted your application to create a company with Jobstack.</p>
        <p>Your application status is PENDING, you'll be notified once it changes (before 24 hours).</p>
        <p>Best regards!</p>
      `,
    });
  }

  async sendPasswordResetMail(to: string, token: string, user: User) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await this.mailerService.sendMail({
      to,
      subject: 'Password reset request',
      html: `
        <h2>Hello, ${user.name},</h2>
        <p>Click <a href="${resetLink}">Reset Password</a> or copy and paste the link in your browser.</p>
        <p>${resetLink}</p>
        <p>This link is valid for 1 hour.</p>
        <p>Best regards!</p>
      `,
    });
  }

  async sendVerificationEmail(name: string, to: string, token: string) {
    const confirmLink = `${process.env.FRONTEND_URL}/auth/new-verification?token=${token}`;
    await this.mailerService.sendMail({
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
