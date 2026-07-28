import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JudgingService } from './judging.service';
import { CreateRubricDto } from './dto/create-rubric.dto';
import { SubmitScoreDto } from './dto/submit-score.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Judging')
@Controller('judging')
export class JudgingController {
  constructor(private readonly judgingService: JudgingService) {}

  @Post('rubric')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a scoring rubric for a hackathon (Organizer/Admin)' })
  async createRubric(@Body() dto: CreateRubricDto) {
    return this.judgingService.createRubric(dto);
  }

  @Get('rubric/hackathon/:hackathonId')
  @ApiOperation({ summary: 'Get all rubrics for a hackathon' })
  async getRubricsByHackathon(@Param('hackathonId') hackathonId: string) {
    return this.judgingService.getRubricsByHackathon(hackathonId);
  }

  @Post('score')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.JUDGE, Role.ORGANIZER, Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Submit a score for a submission (Judge/Organizer/Admin)' })
  async submitScore(
    @CurrentUser('id') judgeId: string,
    @Body() dto: SubmitScoreDto,
  ) {
    return this.judgingService.submitScore(judgeId, dto);
  }

  @Get('leaderboard/:hackathonId')
  @ApiOperation({ summary: 'Get leaderboard rankings for a hackathon' })
  async getLeaderboard(@Param('hackathonId') hackathonId: string) {
    return this.judgingService.getLeaderboard(hackathonId);
  }
}
