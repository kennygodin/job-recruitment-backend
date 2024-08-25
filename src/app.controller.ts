import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomRequest } from './interface/req.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  someProtectedRoute(@Req() req: CustomRequest) {
    return { message: 'Accessed resourse', userId: req.userId };
  }
}
