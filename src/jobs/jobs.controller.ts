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

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('EMPLOYER')
  createJob(@Body() createJobDto: CreateJobDto, @Req() req: CustomRequest) {
    return this.jobsService.createJob(req.userId, createJobDto);
  }

  @Get()
  getAllJobs(
    @Query('title') title?: string,
    @Query('location') location?: string,
  ) {
    return this.jobsService.getAllJobs(title, location);
  }

  @Get(':id')
  getJob(@Param('id') id: string) {
    return this.jobsService.getJob(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('EMPLOYER')
  @Patch(':id')
  updateJob(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Req() req: CustomRequest,
  ) {
    return this.jobsService.updateJob(id, updateJobDto, req.userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('EMPLOYER')
  @Delete(':id')
  deleteJob(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.jobsService.deleteJob(id, req.userId);
  }
}
