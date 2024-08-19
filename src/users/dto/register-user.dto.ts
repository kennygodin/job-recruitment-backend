import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

enum RoleType {
  ADMIN = 'ADMIN',
  EMPLOYER = 'EMPLOYER',
  APPLICANT = 'APPLICANT',
}

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(RoleType, {
    message: `role must be one of the following values: ${Object.values(RoleType).join(', ')}`,
  })
  @IsNotEmpty()
  role: 'ADMIN' | 'EMPLOYER' | 'APPLICANT';

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  companyWebsite?: string;

  @IsOptional()
  @IsString()
  companyAddress?: string;

  @IsOptional()
  @IsString()
  resume?: string;

  @IsOptional()
  @IsString()
  portfolio?: string;
}
