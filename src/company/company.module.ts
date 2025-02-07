import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { DatabaseModule } from 'src/database/database.module';
import { ResendModule } from 'src/utils/resend/resend.module';

@Module({
  imports: [DatabaseModule, ResendModule],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class BusinessModule {}
