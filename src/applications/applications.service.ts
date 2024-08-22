import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { DatabaseService } from 'src/database/database.service';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createApplication(
    userId: string,
    createApplicationDto: CreateApplicationDto,
  ) {
    const { jobId, yearsOfExperience, resume, coverLetter, status } =
      createApplicationDto;
    return await this.databaseService.application.create({
      data: {
        resume,
        coverLetter,
        yearsOfExperience,
        appliedById: userId,
        jobId,
        status,
      },
    });
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

    await this.databaseService.application.update({
      where: {
        applicationId,
      },
      data: {
        status: updateApplicationDto.status,
      },
    });

    return 'Application status updated';
  }
}
