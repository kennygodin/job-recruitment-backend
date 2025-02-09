import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCompanyDto } from './dto/create-company-dto';
import { UpdateCompanyDto } from './dto/update-company-dto';
import { MailService } from 'src/utils/mail/mail.service';

@Injectable()
export class CompanyService {
  constructor(
    private readonly db: DatabaseService,
    private readonly mailService: MailService,
  ) {}

  async getCompanyDetailsByCompany(userId: string) {
    const user = await this.db.user.findUnique({
      where: { userId },
      include: { company: true },
    });

    if (!user || !user.company) {
      throw new NotFoundException('Company not found!');
    }

    return user.company;
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
      await this.mailService.sendUpdateCompanyApprovalEmail(
        company,
        companyStatus,
      );
    }

    if (companyStatus === 'REJECTED') {
      await this.db.company.update({
        where: { companyId },
        data: { companyStatus: 'REJECTED' },
      });

      await this.mailService.sendUpdateCompanyRejectionEmail(
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
      throw new BadRequestException('Company creation failed!');
    }

    await this.mailService.sendCreateCompanyEmailToCompany(company);

    await this.mailService.sendCreateCompanyEmailToAdmin(
      'kenechukwuokoh30@gmail.com',
      company,
    );

    return { message: 'Application sent. Kindly check your email!' };
  }
}
