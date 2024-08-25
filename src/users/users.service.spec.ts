import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';
import { PasswordService } from '../utils/password/password.service';
import { EmailService } from '../utils/email/mail.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let databaseService: jest.Mocked<DatabaseService>;
  let passwordService: jest.Mocked<PasswordService>;

  const databaseMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const passwordMock = {
    hashPassword: jest.fn(),
  };

  const emailMock = {
    sendVerificationEmail: jest.fn(),
  };

  const jwtMock = {
    sign: jest.fn().mockReturnValue('mockJwtToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DatabaseService,
          useValue: databaseMock,
        },
        {
          provide: PasswordService,
          useValue: passwordMock,
        },
        {
          provide: EmailService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: EmailService,
          useValue: emailMock,
        },
        {
          provide: JwtService,
          useValue: jwtMock,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    databaseService = module.get(DatabaseService);
    passwordService = module.get(PasswordService);

    databaseMock.user.findUnique.mockClear();
    databaseMock.user.create.mockClear();
    passwordMock.hashPassword.mockClear();
    emailMock.sendVerificationEmail.mockClear();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('registerUser', () => {
    const registerUserDto: RegisterUserDto = {
      name: 'test name',
      email: 'testemail@gmail.com',
      password: 'test123321!',
      role: 'APPLICANT',
    };

    it('should throw a ConflictException if the user already exists', async () => {
      // databaseMock.user.findUnique.mockResolvedValue(registerUserDto)

      // const result = await usersService.registerUser(registerUserDto)

      databaseMock.user.findUnique.mockResolvedValueOnce({ id: '1' } as any);
      await expect(usersService.registerUser(registerUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should create a new user if the user does not exist', async () => {
      databaseMock.user.findUnique.mockResolvedValueOnce(null);
      passwordService.hashPassword.mockResolvedValueOnce('hashedPassword');

      await usersService.registerUser(registerUserDto);

      expect(databaseMock.user.create).toHaveBeenCalledWith({
        data: {
          ...registerUserDto,
          password: 'hashedPassword',
        },
      });
    });
  });
});
