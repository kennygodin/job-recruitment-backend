import { Module } from '@nestjs/common';
import { ResendService } from './resend.service';

@Module({
  exports: [ResendService],
  providers: [ResendService],
})
export class ResendModule {}
