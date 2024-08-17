import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';
import { PasswordModule } from 'src/utils/password/password.module';
import { EmailModule } from 'src/utils/email/mail.module';

@Module({
  imports: [DatabaseModule, PasswordModule, EmailModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
