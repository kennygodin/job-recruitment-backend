import { JobStatus } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
}

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  jobTitle: string;

  @IsNotEmpty()
  @IsString()
  jobDescription: string;

  @IsOptional()
  @IsString()
  jobCompany: string;

  @IsOptional()
  @IsString()
  jobLocation: string;

  @IsEnum(JobType)
  @IsNotEmpty()
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';

  @IsEnum(JobStatus)
  @IsNotEmpty()
  @IsString()
  jobStatus: 'OPEN' | 'CLOSED';

  @IsNotEmpty()
  @IsString()
  jobExperience: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  keywords: string[];

  @IsNotEmpty()
  @IsString()
  jobSalary: string;

  @IsNotEmpty()
  @IsString()
  jobSummary: string;

  @IsNotEmpty()
  @IsString()
  jobRequirements: string;
}
