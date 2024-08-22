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
import { AuthGuard } from 'src/guards/auth.guard';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business-dto';
import { CustomRequest } from 'src/interface/req.interface';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UpdateBusinessDto } from './dto/update-business-dto';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('EMPLOYER')
  @Post()
  createBusiness(
    @Body() createBusinessDto: CreateBusinessDto,
    @Req() req: CustomRequest,
  ) {
    return this.businessService.createBusiness(req.userId, createBusinessDto);
  }

  @Get(':id')
  getBusiness(@Param('id') id: string) {
    return this.businessService.getBusiness(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updateBusiness(
    @Body() updateBusinessDto: UpdateBusinessDto,
    @Param('id') id: string,
    @Req() req: CustomRequest,
  ) {
    return this.businessService.updateBusiness(
      id,
      req.userId,
      updateBusinessDto,
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  deleteBusiness(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.businessService.deleteBusiness(id, req.userId);
  }
}
