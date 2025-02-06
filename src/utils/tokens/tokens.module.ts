import { Module } from '@nestjs/common';
import { TokenService } from './tokens.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [TokenService, DatabaseService],
  exports: [TokenService],
})
export class TokenModule {}
