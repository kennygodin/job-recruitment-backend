import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenService {
  constructor(
    private readonly db: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async generateVerificationToken(email: string) {
    const token = uuidv4();
    const expires = new Date(Date.now() + 3600 * 1000);

    const existingToken = await this.db.verificationToken.findUnique({
      where: { email },
    });

    if (existingToken) {
      await this.db.verificationToken.delete({
        where: { id: existingToken.id },
      });
    }

    const verificationToken = await this.db.verificationToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    return verificationToken;
  }

  async getVerificationTokenByEmail(email: string) {
    return this.db.verificationToken.findUnique({
      where: { email },
    });
  }

  async getVerificationTokenByToken(token: string) {
    return this.db.verificationToken.findUnique({
      where: { token },
    });
  }

  async deleteVerificationTokenByEmail(email: string) {
    return this.db.verificationToken.delete({
      where: { email },
    });
  }

  async getRefreshTokenByToken(refreshToken: string) {
    const token = await this.db.refreshToken.findUnique({
      where: {
        token: refreshToken,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.db.refreshToken.delete({
      where: {
        token: refreshToken,
      },
    });

    return token;
  }

  async generateUserTokens(userId: string) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1hr' });
    const refreshToken = uuidv4();

    this.storeRefreshToken(refreshToken, userId);

    return { accessToken, refreshToken };
  }

  async storeRefreshToken(token: string, email: string) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    const updatedToken = await this.db.refreshToken.updateMany({
      where: {
        email,
      },
      data: {
        token,
        expires: expiryDate,
      },
    });

    if (updatedToken.count === 0) {
      await this.db.refreshToken.create({
        data: {
          token,
          email,
          expires: expiryDate,
        },
      });
    }
  }
}
