import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateJobDto } from './dto/create-job.dto';

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

    console.log('Query:', query);

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
}
