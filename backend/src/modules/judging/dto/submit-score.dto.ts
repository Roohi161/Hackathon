import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class SubmitScoreDto {
  @IsInt()
  @Min(0)
  @Max(100)
  value: number;

  @IsString()
  @IsOptional()
  feedback?: string;

  @IsString()
  @IsNotEmpty()
  submissionId: string;

  @IsString()
  @IsNotEmpty()
  rubricId: string;
}
