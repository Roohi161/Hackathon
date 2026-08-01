import { Controller, Post, Get, Body, Param, UseGuards, Delete, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateTeamDto, InviteMemberDto, JoinTeamDto } from './dto/teams.dto';

@ApiTags('Teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a team' })
  async create(@Body() createDto: CreateTeamDto, @CurrentUser('id') userId: string) {
    return this.teamsService.create(createDto, userId);
  }

  @Post(':id/invite')
  @ApiOperation({ summary: 'Invite a member to a team' })
  async invite(@Param('id') teamId: string, @Body() inviteDto: InviteMemberDto, @CurrentUser('id') userId: string) {
    return this.teamsService.invite(teamId, inviteDto.email, userId);
  }

  @Post('join')
  @ApiOperation({ summary: 'Join a team via invite code' })
  async join(@Body() joinDto: JoinTeamDto, @CurrentUser('id') userId: string) {
    return this.teamsService.join(joinDto.inviteCode, userId);
  }

  @Delete(':id/leave')
  @ApiOperation({ summary: 'Leave a team' })
  async leave(@Param('id') teamId: string, @CurrentUser('id') userId: string) {
    return this.teamsService.leave(teamId, userId);
  }

  @Patch(':id/transfer-ownership/:memberId')
  @ApiOperation({ summary: 'Transfer team ownership' })
  async transferOwnership(
    @Param('id') teamId: string,
    @Param('memberId') memberId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.teamsService.transferOwnership(teamId, memberId, userId);
  }

  @Delete(':id/kick/:memberId')
  @ApiOperation({ summary: 'Kick a member from the team' })
  async kickMember(
    @Param('id') teamId: string,
    @Param('memberId') memberId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.teamsService.kickMember(teamId, memberId, userId);
  }
}
