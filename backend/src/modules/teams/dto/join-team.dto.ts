import { IsNotEmpty, IsString } from 'class-validator';

export class JoinTeamDto {
  @IsString()
  @IsNotEmpty()
  teamId: string;
}
