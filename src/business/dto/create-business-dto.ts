import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateBusinessDto {
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsNotEmpty()
  companyWebsite: string;

  @IsNotEmpty()
  @IsNotEmpty()
  companyAddress: string;

  @IsEmail()
  @IsNotEmpty()
  notificationEmail: string;

  @IsNotEmpty()
  @IsNotEmpty()
  numberOfEmployees: number;

  @IsNotEmpty()
  @IsNotEmpty()
  industry: string;

  @IsNotEmpty()
  @IsNotEmpty()
  typeOfEmployer: string;

  @IsNotEmpty()
  @IsNotEmpty()
  whereDidYouHear: string;

  @IsNotEmpty()
  @IsNotEmpty()
  countryCode: string;

  @IsNotEmpty()
  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  @IsNotEmpty()
  phone: string;
}
