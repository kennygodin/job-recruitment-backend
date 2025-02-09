import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { DatabaseService } from '../database/database.service';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { MailService } from 'src/utils/mail/mail.service';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly mailService: MailService,
  ) {}

  async updateApplicationStatus(
    userId: string,
    applicationId: string,
    updateApplicationDto: UpdateApplicationDto,
  ) {
    const user = await this.db.user.findUnique({
      where: { userId },
      include: { company: true },
    });

    if (!user || !user.company) {
      throw new NotFoundException('Company not found!');
    }

    const application = await this.db.application.findUnique({
      where: { applicationId },
      include: { job: true, user: true },
    });

    if (!application) {
      throw new NotFoundException('Application not found!');
    }

    if (application.job.jobCompanyId !== user.company.companyId) {
      throw new ForbiddenException('Unauthorized to update this application!');
    }

    const updatedApplication = await this.db.application.update({
      where: { applicationId },
      data: { status: updateApplicationDto.status },
    });

    if (updateApplicationDto.status === 'ACCEPTED') {
      await this.mailService.sendApplicationAcceptedEmail(
        application.user.email,
        application.user.name,
        application.job.jobTitle,
      );
    }

    if (updateApplicationDto.status === 'REJECTED') {
      await this.mailService.sendApplicationRejectedEmail(
        application.user.email,
        application.user.name,
        application.job.jobTitle,
      );
    }

    return updatedApplication;
  }

  async getApplicationByCompany(userId: string, applicationId: string) {
    const user = await this.db.user.findUnique({
      where: { userId },
      include: { company: true },
    });

    if (!user || !user.company) {
      throw new NotFoundException('Company not found!');
    }

    const application = await this.db.application.findUnique({
      where: { applicationId },
      include: { job: true },
    });

    if (!application) {
      throw new NotFoundException('Application not found!');
    }

    if (application.job.jobCompanyId !== user.company.companyId) {
      throw new ForbiddenException('Unauthorized to access this application!');
    }

    return application;
  }

  async getAllApplicationsByCompany(userId: string, page = 1, limit = 10) {
    const user = await this.db.user.findUnique({
      where: { userId },
      include: { company: true },
    });

    if (!user || !user.company) {
      throw new NotFoundException('Company not found!');
    }

    const totalCount = await this.db.application.count({
      where: {
        job: {
          jobCompanyId: user.company.companyId,
        },
      },
    });

    if (totalCount === 0) {
      throw new NotFoundException('No applications yet!');
    }

    const totalPages = Math.ceil(totalCount / limit);
    const offset = (page - 1) * limit;

    const applications = await this.db.application.findMany({
      where: {
        job: {
          jobCompanyId: user.company.companyId,
        },
      },
      skip: offset,
      take: limit,
    });

    return {
      totalCount,
      totalPages,
      currentPage: page,
      applications,
    };
  }

  async createApplication(
    userId: string,
    jobId: string,
    createApplicationDto: CreateApplicationDto,
  ) {
    const job = await this.db.job.findUnique({
      where: { jobId },
      include: { company: true },
    });

    if (!job) {
      throw new NotFoundException('Job does not exist!');
    }

    const application = await this.db.application.findFirst({
      where: {
        userId,
        jobId,
      },
    });

    if (application) {
      throw new UnauthorizedException('Already applied!');
    }

    const newApplication = await this.db.application.create({
      data: {
        status: 'PENDING',
        userId,
        jobId,
        ...createApplicationDto,
      },
    });

    await this.mailService.applicationMailToCompany(
      job.company.notificationEmail,
      job.company.companyName,
      job.jobTitle,
      newApplication.name,
    );

    return { message: 'Job applied!' };
  }
}
