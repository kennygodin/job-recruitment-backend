import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { CustomRequest } from 'src/interface/req.interface';
import { AuthGuard } from '../guards/auth.guard';
import { ApplicationsService } from './applications.service';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationService: ApplicationsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Post('create-application/:id')
  createApplication(
    @Body() createApplicationDto: CreateApplicationDto,
    @Req() req: CustomRequest,
    @Param('id') jobId: string,
  ) {
    return this.applicationService.createApplication(
      req.userId,
      jobId,
      createApplicationDto,
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Get('get-company-application/:id')
  getApplicationByCompany(
    @Req() req: CustomRequest,
    @Param('id') applicationId: string,
  ) {
    return this.applicationService.getApplicationByCompany(
      req.userId,
      applicationId,
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Get('get-company-applications')
  getAllApplicationsByCompany(
    @Req() req: CustomRequest,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.applicationService.getAllApplicationsByCompany(
      req.userId,
      Number(page),
      Number(limit),
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Patch('update-application-status/:id')
  async updateApplicationStatus(
    @Req() req: CustomRequest,
    @Param('id') applicationId: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.applicationService.updateApplicationStatus(
      req.userId,
      applicationId,
      updateApplicationDto,
    );
  }
}
