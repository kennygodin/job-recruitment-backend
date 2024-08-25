import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
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

  @UseGuards(AuthGuard)
  @Post()
  createApplication(
    @Body() createApplicationDto: CreateApplicationDto,
    @Req() req: CustomRequest,
  ) {
    return this.applicationService.createApplication(
      req.userId,
      createApplicationDto,
    );
  }

  @Get()
  getApplications() {
    return this.applicationService.getApplications();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getApplication(@Param('id') id: string) {
    return this.applicationService.getApplication(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('EMPLOYER')
  @Patch(':id')
  updateApplication(
    @Body() updateApplicationDto: UpdateApplicationDto,
    @Param('id') id: string,
    @Req() req: CustomRequest,
  ) {
    return this.applicationService.updateApplication(
      id,
      updateApplicationDto,
      req.userId,
    );
  }
}
