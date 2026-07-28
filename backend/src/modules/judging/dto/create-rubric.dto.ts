import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateRubricDto {
  @IsString()
  @IsNotEmpty()
  criteriaName: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  weight?: number;

  @IsString()
  @IsNotEmpty()
  hackathonId: string;
}
