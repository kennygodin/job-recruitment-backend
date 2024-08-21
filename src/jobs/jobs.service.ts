import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createJob(userId: string, createJobDto: CreateJobDto) {
    const { title, description, company, location, type } = createJobDto;

    return await this.databaseService.job.create({
      data: {
        title,
        description,
        company,
        location,
        type,
        postedById: userId,
        status: 'OPEN',
      },
    });
  }

  async getAllJobs(title?: string, location?: string) {
    const query: { [key: string]: any } = {};

    if (title) {
      query.title = new RegExp(title, 'i');
    }

    if (location) {
      query.location = location;
    }

    const jobs = await this.databaseService.job.findMany({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
        location,
      },
    });
    if (!jobs.length) {
      throw new NotFoundException('No jobs found');
    }

    return jobs;
  }

  async getJob(jobId: string) {
    const job = await this.databaseService.job.findUnique({
      where: {
        jobId,
      },
    });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  async updateJob(jobId: string, updateJobDto: UpdateJobDto, userId: string) {
    const job = await this.databaseService.job.findUnique({
      where: { jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.postedById !== userId) {
      throw new UnauthorizedException(
        'You can only update the job you created',
      );
    }

    return await this.databaseService.job.update({
      where: { jobId },
      data: {
        ...updateJobDto,
      },
    });
  }

  async deleteJob(jobId: string, userId: string) {
    const job = await this.databaseService.job.findUnique({
      where: {
        jobId,
      },
    });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.postedById !== userId) {
      throw new UnauthorizedException(
        'You can only delete the job you created',
      );
    }

    await this.databaseService.job.delete({
      where: {
        jobId,
      },
    });

    return 'Job posting deleted';
  }
}
