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
import { AuthGuard } from '../guards/auth.guard';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company-dto';
import { CustomRequest } from 'src/interface/req.interface';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UpdateCompanyDto } from './dto/update-company-dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Post('create-company')
  createCompany(
    @Body() createCompanyDto: CreateCompanyDto,
    @Req() req: CustomRequest,
  ) {
    return this.companyService.createCompany(req.userId, createCompanyDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('update-company-status/:id')
  updateCompanyStatusByAdmin(
    @Param('id') companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.updateCompanyStatusByAdmin(
      companyId,
      updateCompanyDto,
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER')
  @Get('get-company-details')
  getCompanyDetailsByCompany(@Req() req: CustomRequest) {
    return this.companyService.getCompanyDetailsByCompany(req.userId);
  }
}
