import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHackathonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsOptional()
  status?: string; // DRAFT, PUBLISHED, ONGOING, COMPLETED
}
