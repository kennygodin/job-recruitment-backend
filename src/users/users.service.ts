import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { PasswordService } from '../utils/password/password.service';
import { LoginUserDto } from './dto/login-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TokenService } from 'src/utils/tokens/tokens.service';
import { MailService } from 'src/utils/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly db: DatabaseService,
    private readonly passwordService: PasswordService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const { name, email, password } = registerUserDto;
    const userExist = await this.db.user.findUnique({
      where: {
        email,
      },
    });
    if (userExist) {
      throw new ConflictException('Email already exists!');
    }

    // hash password before saving to db
    const hashedPassword = await this.passwordService.hashPassword(password);
    const userData: Prisma.UserCreateInput = {
      ...registerUserDto,
      password: hashedPassword,
      role: 'USER',
    };

    await this.db.user.create({
      data: userData,
    });

    // Send verification email
    const { token } = await this.tokenService.generateVerificationToken(email);
    await this.mailService.sendVerificationEmail(name, email, token);

    return { message: 'Email sent!' };
  }

  async verifyUserEmail(token: string) {
    if (!token) {
      throw new UnauthorizedException('Token is required!');
    }

    const tokenData =
      await this.tokenService.getVerificationTokenByToken(token);

    if (!tokenData) {
      throw new UnauthorizedException('Invalid token!');
    }

    await this.db.user.update({
      where: { email: tokenData.email },
      data: { isVerified: true },
    });

    await this.tokenService.deleteVerificationTokenByEmail(tokenData.email);

    return { message: 'User verified!' };
  }

  async loginUser(loginInUserDto: LoginUserDto) {
    const { email, password } = loginInUserDto;
    const user = await this.db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    if (!user.isVerified) {
      const { token } =
        await this.tokenService.generateVerificationToken(email);
      await this.mailService.sendVerificationEmail(user.name, email, token);
      throw new UnauthorizedException('Verification email sent!');
    }

    const passwordIsCorrect = await this.passwordService.comparePasswords(
      password,
      user.password,
    );

    if (!passwordIsCorrect) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    return this.tokenService.generateUserTokens(user.userId);
  }

  async refreshTokens(refreshToken: string) {
    await this.tokenService.getRefreshTokenByToken(refreshToken);
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePasswordDto;

    const user = await this.db.user.findUnique({
      where: { userId },
    });
    if (!user) {
      throw new UnauthorizedException('User not found!');
    }

    const passwordIsCorrect = await this.passwordService.comparePasswords(
      oldPassword,
      user.password,
    );

    if (!passwordIsCorrect) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    const hashedPassword = await this.passwordService.hashPassword(newPassword);
    await this.db.user.update({
      where: { userId },
      data: { password: hashedPassword },
    });
    return { message: 'Password updated!' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.db.user.findUnique({
      where: {
        email: forgotPasswordDto.email,
      },
    });

    if (user) {
      const token = uuidv4();
      const expires = new Date();
      expires.setHours(expires.getHours() + 1);

      await this.db.resetToken.delete({
        where: { email: user.email },
      });

      await this.db.resetToken.create({
        data: {
          token,
          email: user.email,
          expires,
        },
      });

      this.mailService.sendPasswordResetMail(
        forgotPasswordDto.email,
        token,
        user,
      );
    }

    return { message: 'Email send!' };
  }

  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto) {
    const { password } = resetPasswordDto;

    const resetToken = await this.db.resetToken.delete({
      where: {
        token,
        expires: { gte: new Date() },
      },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid link!');
    }

    const hashedPassword = await this.passwordService.hashPassword(password);
    await this.db.user.update({
      where: {
        email: resetToken.email,
      },
      data: {
        password: hashedPassword,
      },
    });

    return { message: 'Password changed!' };
  }
}
