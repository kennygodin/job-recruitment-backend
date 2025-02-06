import { Module } from '@nestjs/common';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { DatabaseModule } from 'src/database/database.module';
import { ResendModule } from 'src/utils/resend/resend.module';

@Module({
  imports: [DatabaseModule, ResendModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationModule {}
