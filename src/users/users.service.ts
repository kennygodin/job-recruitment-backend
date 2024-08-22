import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { PasswordService } from 'src/utils/password/password.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { nanoid } from 'nanoid';
import { EmailService } from 'src/utils/email/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly passwordService: PasswordService,
    private readonly EmailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, password } = registerUserDto;
    const userExist = await this.databaseService.user.findUnique({
      where: {
        email,
      },
    });
    if (userExist) {
      throw new ConflictException('User with this email already exists');
    }
    // hash password before saving to db
    const hashedPassword = await this.passwordService.hashPassword(password);
    const userData: Prisma.UserCreateInput = {
      ...registerUserDto,
      password: hashedPassword,
    };

    return this.databaseService.user.create({
      data: userData,
    });
  }

  async loginUser(signInUserDto: LoginUserDto) {
    const { email, password } = signInUserDto;
    const user = await this.databaseService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email not registered');
    }

    const passwordIsCorrect = await this.passwordService.comparePasswords(
      password,
      user.password,
    );
    if (user && passwordIsCorrect) {
      return this.generateUserTokens(user.userId);
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async refreshTokens(refreshToken: string) {
    // Retrieve the refresh token record from the database
    const token = await this.databaseService.refreshToken.findUnique({
      where: {
        token: refreshToken,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.databaseService.refreshToken.delete({
      where: {
        token: refreshToken,
      },
    });

    // Generate new access and refresh tokens using the userId
    return this.generateUserTokens(token.userId);
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePasswordDto;

    const user = await this.databaseService.user.findUnique({
      where: { userId },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordIsCorrect = await this.passwordService.comparePasswords(
      oldPassword,
      user.password,
    );

    if (!passwordIsCorrect) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hashedPassword = await this.passwordService.hashPassword(newPassword);
    await this.databaseService.user.update({
      where: { userId },
      data: { password: hashedPassword },
    });
    return { message: 'Password updated' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.databaseService.user.findUnique({
      where: {
        email: forgotPasswordDto.email,
      },
    });

    if (user) {
      const resetToken = nanoid(64);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      // reset token

      await this.databaseService.resetToken.create({
        data: {
          token: resetToken,
          userId: user.userId,
          expiresAt: expiryDate,
        },
      });

      this.EmailService.sendPasswordResetMail(
        forgotPasswordDto.email,
        resetToken,
        user,
      );
    }

    return { message: 'User will receive an email if it exists' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { resetToken, newPassword } = resetPasswordDto;
    const token = await this.databaseService.resetToken.delete({
      where: {
        token: resetToken,
        expiresAt: { gte: new Date() },
      },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid link');
    }

    const hashedPassword = await this.passwordService.hashPassword(newPassword);
    await this.databaseService.user.update({
      where: {
        userId: token.userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return { message: 'Password changed' };
  }

  async generateUserTokens(userId: string) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1hr' });
    const refreshToken = uuidv4();

    this.storeRefreshToken(refreshToken, userId);

    return { accessToken, refreshToken };
  }

  async storeRefreshToken(token: string, userId: string) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);
    const updatedToken = await this.databaseService.refreshToken.updateMany({
      where: {
        userId,
      },
      data: {
        token,
        expiresAt: expiryDate,
      },
    });

    if (updatedToken.count === 0) {
      await this.databaseService.refreshToken.create({
        data: {
          token,
          userId,
          expiresAt: expiryDate,
        },
      });
    }
  }
}
