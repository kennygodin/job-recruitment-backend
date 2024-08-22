import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
}

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  jobId: string;

  @IsString()
  @IsNotEmpty()
  yearsOfExperience: string;

  @IsString()
  @IsOptional()
  resume: string;

  @IsString()
  @IsOptional()
  coverLetter: string;

  @IsEnum(ApplicationStatus, {
    message: `status must be one of the following values: ${Object.values(ApplicationStatus).join(', ')}`,
  })
  @IsOptional()
  status: 'PENDING' | 'REVIEWED' | 'REJECTED' | 'ACCEPTED';
}
