import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { DatabaseModule } from 'src/database/database.module';
import { MailModule } from 'src/utils/mail/mail.module';

@Module({
  imports: [DatabaseModule, MailModule],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class BusinessModule {}
