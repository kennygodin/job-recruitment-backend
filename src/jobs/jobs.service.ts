import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobType } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(private readonly db: DatabaseService) {}

  async deleteJobByCompany(userId: string, jobId: string) {
    const user = await this.db.user.findUnique({
      where: { userId },
      include: { company: true },
    });

    if (user.company && user.company.userId === userId) {
      const jobs = await this.db.job.findUnique({
        where: { jobId, jobCompanyId: user.company.companyId },
      });

      if (!jobs) {
        // return { message: 'No job found!' };
        throw new NotFoundException('No jobs found!');
      }

      await this.db.job.delete({
        where: { jobId, jobCompanyId: user.company.companyId },
      });

      return { message: 'Job deleted!' };
    }
    throw new UnauthorizedException('Unauthorized to delete job!');
  }

  async updateJobByCompany(
    userId: string,
    jobId: string,
    updateJobDto?: UpdateJobDto,
  ) {
    const user = await this.db.user.findUnique({
      where: { userId },
      include: { company: true },
    });

    if (user.company && user.company.userId === userId) {
      const jobs = await this.db.job.findUnique({
        where: { jobId, jobCompanyId: user.company.companyId },
      });

      if (!jobs) {
        return { message: 'No job found!' };
      }

      await this.db.job.update({
        where: { jobId, jobCompanyId: user.company.companyId },
        data: {
          ...updateJobDto,
        },
      });

      return { message: 'Job updated!' };
    }
    throw new UnauthorizedException('Unauthorized to get jobs!');
  }

  async getAllJobsByCompany(userId: string) {
    const user = await this.db.user.findUnique({
      where: { userId },
      include: { company: true },
    });

    if (user.company && user.company.userId === userId) {
      const jobs = await this.db.job.findMany({
        where: { jobCompanyId: user.company.companyId },
      });

      if (!jobs) {
        throw new NotFoundException('No jobs found!');
        // return { message: 'No job found!' };
      }

      return jobs;
    }
    throw new UnauthorizedException('Unauthorized to get jobs!');
  }

  async getJobByCompany(userId: string, jobId: string) {
    const user = await this.db.user.findUnique({
      where: { userId },
      include: { company: true },
    });

    if (user.company && user.company.userId === userId) {
      const job = await this.db.job.findUnique({
        where: { jobId, jobCompanyId: user.company.companyId },
      });

      if (!job) {
        throw new NotFoundException('No job found!');
        // return { message: 'Job not found!' };
      }

      return job;
    }

    throw new UnauthorizedException('Unauthorized to get this job!');
  }

  async getJob(jobId: string) {
    const job = await this.db.job.findUnique({
      where: {
        jobId,
      },
    });
    if (!job) {
      throw new NotFoundException('No jobs found!');

      // return { message: 'Job not found!' };
    }

    return job;
  }

  async getJobs(
    jobTitle?: string,
    jobLocation?: string,
    jobType?: JobType,
    page: number = 1,
    limit: number = 10,
  ) {
    const pageNumber = Math.max(1, page);
    const pageSize = Math.max(1, limit);
    const skip = (pageNumber - 1) * pageSize;

    const filters: any = { jobStatus: 'OPEN' };

    if (jobTitle) {
      filters.jobTitle = { contains: jobTitle, mode: 'insensitive' };
    }
    if (jobLocation) {
      filters.jobLocation = jobLocation;
    }
    if (jobType) {
      filters.jobType = jobType;
    }

    const jobs = await this.db.job.findMany({
      where: filters,
      skip,
      take: pageSize,
    });

    const totalJobs = await this.db.job.count({ where: filters });

    if (!jobs.length) {
      throw new NotFoundException('No jobs found!');
      // return { message: 'No jobs found!' };
    }

    return {
      currentPage: pageNumber,
      totalPages: Math.ceil(totalJobs / pageSize),
      totalJobs,
      jobs,
    };
  }

  async createJob(userId: string, createJobDto: CreateJobDto) {
    const {
      jobTitle,
      jobDescription,
      jobType,
      jobExperience,
      jobRequirements,
      jobSalary,
      jobStatus,
      jobSummary,
      jobLocation,
    } = createJobDto;

    const user = await this.db.user.findUnique({
      where: { userId },
      include: { company: true },
    });

    if (user.company && user.company.userId === userId) {
      await this.db.job.create({
        data: {
          jobTitle,
          jobDescription,
          jobCompanyId: user.company.companyId,
          jobLocation,
          jobType,
          jobStatus,
          jobExperience,
          jobRequirements,
          jobSalary,
          jobSummary,
        },
      });

      return { message: 'Job created!' };
    }

    throw new UnauthorizedException('Unauthorized to create jobs!');
  }
}
