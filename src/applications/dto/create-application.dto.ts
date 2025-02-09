import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

enum ApplicationStatus {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
}

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  // @IsString()
  // @IsNotEmpty()
  // jobId: string;

  @IsString()
  @IsNotEmpty()
  yearsOfExperience: string;

  @IsString()
  @IsNotEmpty()
  resume: string;

  @IsString()
  @IsOptional()
  coverLetter: string;

  @IsEnum(ApplicationStatus)
  @IsOptional()
  status: 'PENDING' | 'REJECTED' | 'ACCEPTED';
}
