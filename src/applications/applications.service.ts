import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { DatabaseService } from '../database/database.service';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { EmailService } from '../utils/email/mail.service';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly emailService: EmailService,
  ) {}

  async createApplication(
    userId: string,
    createApplicationDto: CreateApplicationDto,
  ) {
    const { jobId, yearsOfExperience, resume, coverLetter } =
      createApplicationDto;
    // Find is an application by the user already exists
    const applicationExists = this.databaseService.application.findMany({
      where: {
        appliedById: userId,
        jobId,
      },
    });

    if (applicationExists) {
      throw new UnauthorizedException('Application to this job exists already');
    }
    const newApplication = await this.databaseService.application.create({
      data: {
        resume,
        coverLetter,
        yearsOfExperience,
        appliedById: userId,
        jobId,
        status: 'PENDING',
      },
    });

    const application = await this.databaseService.application.findUnique({
      where: {
        applicationId: newApplication.applicationId,
      },
      include: {
        job: {
          include: {
            postedBy: true,
          },
        },
        appliedBy: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const { email, name } = application.job.postedBy;

    this.emailService.sendCreateApplicationMail(
      email,
      name,
      application.job,
      application.status,
      application.applicationId,
    );

    return application;
  }

  async getApplications() {
    const applications = await this.databaseService.application.findMany();
    if (!applications.length) {
      throw new NotFoundException('Applications not found');
    }

    return applications;
  }

  async getApplication(applicationId: string) {
    return this.databaseService.application.findUnique({
      where: {
        applicationId,
      },
    });
  }

  async updateApplication(
    applicationId: string,
    updateApplicationDto: UpdateApplicationDto,
    userId: string,
  ) {
    const application = await this.databaseService.application.findUnique({
      where: {
        applicationId,
      },
      include: {
        job: {
          include: {
            postedBy: true,
          },
        },
        appliedBy: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.job.postedById !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this application',
      );
    }

    const update = await this.databaseService.application.update({
      where: {
        applicationId,
      },
      data: {
        status: updateApplicationDto.status,
      },
    });

    // Send notification email when status changes
    const { name, email } = application.appliedBy;

    this.emailService.sendApplicationStatusMail(
      email,
      name,
      application.job,
      update.status,
      update.applicationId,
    );

    return 'Application status updated';
  }
}
