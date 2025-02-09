import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';
import { PasswordModule } from 'src/utils/password/password.module';
import { ResendModule } from 'src/utils/resend/resend.module';
import { TokenModule } from 'src/utils/tokens/tokens.module';
import { MailModule } from 'src/utils/mail/mail.module';

@Module({
  imports: [DatabaseModule, PasswordModule, MailModule, TokenModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
