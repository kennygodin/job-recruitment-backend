import { Module } from '@nestjs/common';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { DatabaseModule } from 'src/database/database.module';
import { ResendModule } from 'src/utils/resend/resend.module';
import { MailModule } from 'src/utils/mail/mail.module';

@Module({
  imports: [DatabaseModule, ResendModule, MailModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationModule {}
