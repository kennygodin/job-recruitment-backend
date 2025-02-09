import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { JobsService } from './jobs.service';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UpdateJobDto } from './dto/update-job.dto';
import { CustomRequest } from 'src/interface/req.interface';
import { JobType } from '@prisma/client';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // CREATE JOB BY COMPANY
  @Post('create-job')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  createJob(@Body() createJobDto: CreateJobDto, @Req() req: CustomRequest) {
    return this.jobsService.createJob(req.userId, createJobDto);
  }

  // GET ALL BY USER
  @Get('get-all-jobs')
  getAllJobs(
    @Query('title') jobTitle?: string,
    @Query('location') jobLocation?: string,
    @Query('type') jobType?: JobType,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.jobsService.getJobs(
      jobTitle,
      jobLocation,
      jobType,
      page,
      limit,
    );
  }

  // GET ALL BY COMPANY
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Get('get-company-jobs')
  getAllJobsByCompany(@Req() req: CustomRequest) {
    return this.jobsService.getAllJobsByCompany(req.userId);
  }

  // GET ONE BY COMPANY
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Get('get-company-jobs/:id')
  getJobByCompany(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.jobsService.getJobByCompany(req.userId, id);
  }

  // GET ONE BY USER
  @Get(':id')
  getJob(@Param('id') id: string) {
    return this.jobsService.getJob(id);
  }

  // UPDATE ONE BY COMPANY
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Patch('update-company-jobs/:id')
  updateJobByCompany(
    @Param('id') id: string,
    @Req() req: CustomRequest,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobsService.updateJobByCompany(req.userId, id, updateJobDto);
  }

  // DELETE ONE BY COMPANY
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Delete('delete-company-jobs/:id')
  deleteJobByCompany(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.jobsService.deleteJobByCompany(req.userId, id);
  }
}
