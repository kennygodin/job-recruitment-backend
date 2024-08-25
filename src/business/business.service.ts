import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateBusinessDto } from './dto/create-business-dto';
import { UpdateBusinessDto } from './dto/update-business-dto';

@Injectable()
export class BusinessService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createBusiness(userId: string, createBusinessDto: CreateBusinessDto) {
    const {
      companyName,
      companyWebsite,
      companyAddress,
      notificationEmail,
      numberOfEmployees,
      industry,
      typeOfEmployer,
      whereDidYouHear,
      countryCode,
      country,
      phone,
    } = createBusinessDto;

    return await this.databaseService.business.create({
      data: {
        companyName,
        companyAddress,
        companyWebsite,
        notificationEmail,
        numberOfEmployees,
        industry,
        typeOfEmployer,
        whereDidYouHear,
        country,
        countryCode,
        phone,
        userId,
      },
    });
  }

  async getBusiness(businessId: string) {
    const business = this.databaseService.business.findUnique({
      where: {
        businessId,
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }
    return business;
  }

  async updateBusiness(
    businessId: string,
    userId: string,
    updateBusinessDto: UpdateBusinessDto,
  ) {
    const business = await this.databaseService.business.findUnique({
      where: {
        businessId,
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    if (business.userId !== userId) {
      throw new UnauthorizedException(
        'You can only update the business you created',
      );
    }

    return await this.databaseService.business.update({
      where: {
        businessId,
      },
      data: { ...updateBusinessDto },
    });
  }

  async deleteBusiness(businessId: string, userId: string) {
    const business = await this.databaseService.business.findUnique({
      where: {
        businessId,
      },
    });
    if (!business) {
      throw new NotFoundException('Job not found');
    }

    if (business.userId !== userId) {
      throw new UnauthorizedException(
        'You can only delete the business you created',
      );
    }

    await this.databaseService.business.delete({
      where: {
        businessId,
      },
    });

    return 'Business deleted';
  }
}
