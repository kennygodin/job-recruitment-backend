import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
} from 'class-validator';

export enum CompanyStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  companyWebsite: string;

  @IsNotEmpty()
  companyAddress: string;

  @IsEmail()
  @IsNotEmpty()
  notificationEmail: string;

  @IsNotEmpty()
  numberOfEmployees: string;

  @IsNotEmpty()
  industry: string;

  @IsNotEmpty()
  cacDocument: string;

  @IsNotEmpty()
  whereDidYouHear: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @IsOptional()
  @IsEnum(CompanyStatus, {
    message: 'companyStatus must be one of: PENDING, ACCEPTED, REJECTED',
  })
  companyStatus: CompanyStatus;
}
