import { Module } from '@nestjs/common';
import { EmailService } from './mail.service';

@Module({
  exports: [EmailService],
  providers: [EmailService],
})
export class EmailModule {}
