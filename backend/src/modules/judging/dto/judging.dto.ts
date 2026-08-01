import { IsString, IsNotEmpty, IsNumber, Min, Max, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AssignJudgeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  judgeId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  submissionId!: string;
}

export class CriteriaScoreDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  criteriaId!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  score!: number;
}

export class SubmitScoreDto {
  @ApiProperty({ type: [CriteriaScoreDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CriteriaScoreDto)
  scores!: CriteriaScoreDto[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  feedback?: string;
}
