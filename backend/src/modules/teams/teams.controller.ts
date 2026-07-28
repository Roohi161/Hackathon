import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { JoinTeamDto } from './dto/join-team.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Teams')
@ApiBearerAuth('JWT-auth')
@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new team for a hackathon' })
  async createTeam(@CurrentUser('id') userId: string, @Body() dto: CreateTeamDto) {
    return this.teamsService.createTeam(userId, dto);
  }

  @Post('join')
  @ApiOperation({ summary: 'Join an existing team by team ID' })
  async joinTeam(@CurrentUser('id') userId: string, @Body() dto: JoinTeamDto) {
    return this.teamsService.joinTeam(userId, dto);
  }

  @Get('hackathon/:hackathonId')
  @ApiOperation({ summary: 'Get all teams for a hackathon' })
  async findByHackathon(@Param('hackathonId') hackathonId: string) {
    return this.teamsService.findByHackathon(hackathonId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team details by team ID' })
  async findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }
}
