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

  @UseGuards(AuthGuard)
  @Post('create-company')
  createCompany(
    @Body() createCompanyDto: CreateCompanyDto,
    @Req() req: CustomRequest,
  ) {
    return this.companyService.createCompany(req.userId, createCompanyDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('status/:id')
  updateCompanyStatusByAdmin(
    @Param('id') companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.updateCompanyStatusByAdmin(
      companyId,
      updateCompanyDto,
    );
  }

  @UseGuards(AuthGuard)
  @Get('status/:id')
  getCompanyStatusByCompany(
    @Param('id') companyId: string,
    @Req() req: CustomRequest,
  ) {
    return this.companyService.getCompanyDetailsByCompany(
      req.userId,
      companyId,
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updateBusiness(
    @Body() updateBusinessDto: UpdateCompanyDto,
    @Param('id') id: string,
    @Req() req: CustomRequest,
  ) {
    return null;
    // return this.businessService.updateBusiness(
    //   id,
    //   req.userId,
    //   updateBusinessDto,
    // );
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  deleteBusiness(@Param('id') id: string, @Req() req: CustomRequest) {
    return null;
    // return this.businessService.deleteBusiness(id, req.userId);
  }
}
