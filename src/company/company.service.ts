import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCompanyDto } from './dto/create-company-dto';
import { UpdateCompanyDto } from './dto/update-company-dto';
import { ResendService } from 'src/utils/resend/resend.service';

@Injectable()
export class CompanyService {
  constructor(
    private readonly db: DatabaseService,
    private readonly resendService: ResendService,
  ) {}

  async getCompanyDetailsByCompany(userId: string, companyId: string) {
    const company = await this.db.company.findUnique({
      where: { companyId, userId },
    });

    if (!company) {
      throw new NotFoundException('Company details not found!');
    }

    return company;
  }

  async updateCompanyStatusByAdmin(
    companyId: string,
    updateCompanyDto: UpdateCompanyDto,
  ) {
    const { companyStatus } = updateCompanyDto;

    if (!companyStatus) {
      throw new BadRequestException('Company status required!');
    }

    const company = await this.db.company.findUnique({
      where: { companyId },
    });

    if (!company) {
      throw new NotFoundException('Company application not found!');
    }

    if (companyStatus === 'ACCEPTED') {
      await this.db.company.update({
        where: { companyId },
        data: { companyStatus: 'ACCEPTED' },
      });
      await this.resendService.sendUpdateCompanyUpdateApprovalEmailToCompany(
        company,
        companyStatus,
      );
    }

    if (companyStatus === 'REJECTED') {
      await this.db.company.update({
        where: { companyId },
        data: { companyStatus: 'REJECTED' },
      });

      await this.resendService.sendUpdateCompanyUpdateRejectionEmailToCompany(
        company,
        companyStatus,
      );
    }

    return { message: 'Company status updated!' };
  }

  async createCompany(userId: string, createCompanyDto: CreateCompanyDto) {
    const {
      companyName,
      companyWebsite,
      companyAddress,
      notificationEmail,
      numberOfEmployees,
      industry,
      cacDocument,
      whereDidYouHear,
      country,
      phone,
      companyStatus,
    } = createCompanyDto;

    const companyExists = await this.db.company.findUnique({
      where: { userId },
    });

    if (companyExists) {
      await this.db.company.delete({
        where: { userId },
      });
    }

    const company = await this.db.company.create({
      data: {
        companyName,
        companyAddress,
        companyWebsite,
        notificationEmail,
        numberOfEmployees,
        industry,
        whereDidYouHear,
        country,
        cacDocument,
        phone,
        userId,
        companyStatus: 'PENDING',
      },
    });

    if (!company) {
      throw new NotFoundException('Company creation failed!');
    }

    await this.resendService.sendCreateCompanyEmailToCompany(company);

    await this.resendService.sendCreateCompanyEmailToAdmin(
      'kenechukwuokoh30@gmail.com',
      company,
    );

    return { message: 'Application sent. Kindly check your email!' };
  }

  // async getBusiness(businessId: string) {
  //   const business = this.databaseService.business.findUnique({
  //     where: {
  //       businessId,
  //     },
  //   });

  //   if (!business) {
  //     throw new NotFoundException('Business not found');
  //   }
  //   return business;
  // }

  // async updateBusiness(
  //   businessId: string,
  //   userId: string,
  //   updateBusinessDto: UpdateBusinessDto,
  // ) {
  //   const business = await this.databaseService.business.findUnique({
  //     where: {
  //       businessId,
  //     },
  //   });

  //   if (!business) {
  //     throw new NotFoundException('Business not found');
  //   }

  //   if (business.userId !== userId) {
  //     throw new UnauthorizedException(
  //       'You can only update the business you created',
  //     );
  //   }

  //   return await this.databaseService.business.update({
  //     where: {
  //       businessId,
  //     },
  //     data: { ...UpdateBusinessDto },
  //   });
  // }

  // async deleteBusiness(businessId: string, userId: string) {
  //   const business = await this.databaseService.business.findUnique({
  //     where: {
  //       businessId,
  //     },
  //   });
  //   if (!business) {
  //     throw new NotFoundException('Job not found');
  //   }

  //   if (business.userId !== userId) {
  //     throw new UnauthorizedException(
  //       'You can only delete the business you created',
  //     );
  //   }

  //   await this.databaseService.business.delete({
  //     where: {
  //       businessId,
  //     },
  //   });

  //   return 'Business deleted';
  // }
}
