import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(['ADMIN', 'EMPLOYER', 'APPLICANT'])
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
