import { Controller, Post, Body, Param, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JudgingService } from './judging.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AssignJudgeDto, SubmitScoreDto } from './dto/judging.dto';

@ApiTags('Judging')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('judging')
export class JudgingController {
  constructor(private readonly judgingService: JudgingService) {}

  @Post('assign')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'ORGANIZER')
  @ApiOperation({ summary: 'Assign judge to submission' })
  async assignJudge(@Body() dto: AssignJudgeDto) {
    return this.judgingService.assignJudge(dto);
  }

  @Post('submissions/:id/score')
  @UseGuards(RolesGuard)
  @Roles('JUDGE')
  @ApiOperation({ summary: 'Submit scores for a submission' })
  async submitScore(
    @Param('id') submissionId: string,
    @Body() dto: SubmitScoreDto,
    @CurrentUser('id') judgeId: string
  ) {
    return this.judgingService.submitScore(submissionId, judgeId, dto);
  }

  @Get('hackathon/:id/leaderboard')
  @ApiOperation({ summary: 'Get leaderboard for a hackathon' })
  async getLeaderboard(@Param('id') hackathonId: string) {
    return this.judgingService.getLeaderboard(hackathonId);
  }
}
