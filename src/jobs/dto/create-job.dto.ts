import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';

enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
}

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsEnum(JobType, {
    message: `Job type must be one of the following values: ${Object.values(JobType).join(', ')}`,
  })
  @IsNotEmpty()
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';

  bStatus: 'OPEN' | 'CLOSED';

  @IsOptional()
  @IsString()
  industry: string;

  @IsOptional()
  @IsString()
  experience: string;

  @IsOptional()
  @IsString()
  salary: string;

  @IsOptional()
  @IsBoolean()
  negotiable: boolean;

  @IsOptional()
  @IsString()
  jobSummary: string;

  @IsOptional()
  @IsString()
  jobRequirements: string;
}
