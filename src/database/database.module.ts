import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
  exports: [DatabaseService],
  controllers: [],
  providers: [DatabaseService],
})
export class DatabaseModule {}
