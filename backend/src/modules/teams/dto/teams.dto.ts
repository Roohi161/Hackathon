import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  hackathonId!: string;
}

export class InviteMemberDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email!: string;
}

export class JoinTeamDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  inviteCode!: string;
}
