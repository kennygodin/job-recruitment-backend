import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.registerUser(registerUserDto);
  }

  @Get('new-verification')
  verifyUserEmail(@Query('token') token: string) {
    return this.usersService.verifyUserEmail(token);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.loginUser(loginUserDto);
  }

  @Post('refresh')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.usersService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @UseGuards(AuthGuard)
  @Put('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req) {
    return this.usersService.changePassword(req.userId, changePasswordDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.usersService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  resetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.usersService.resetPassword(token, resetPasswordDto);
  }

  @Patch('update')
  updateUser() {
    return 'User info updated';
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  fetchAllUsers() {
    return [{ id: 1 }, { id: 2 }];
  }

  @Get(':id')
  fetchUser(id: string) {
    return { id: 1 };
  }
}
