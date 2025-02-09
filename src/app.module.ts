import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JobsModule } from './jobs/jobs.module';
import { BusinessModule } from './company/company.module';
import { ApplicationModule } from './applications/application.module';
import { MailModule } from './utils/mail/mail.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    JobsModule,
    BusinessModule,
    ApplicationModule,
    MailModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
