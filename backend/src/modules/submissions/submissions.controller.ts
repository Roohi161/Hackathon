import { Controller, Post, Put, Body, Param, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateSubmissionDto, UpdateSubmissionDto } from './dto/submissions.dto';

@ApiTags('Submissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a draft submission' })
  async createDraft(@Body() createDto: CreateSubmissionDto, @CurrentUser('id') userId: string) {
    return this.submissionsService.createDraft(createDto, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a draft submission' })
  async updateDraft(@Param('id') id: string, @Body() updateDto: UpdateSubmissionDto, @CurrentUser('id') userId: string) {
    return this.submissionsService.updateDraft(id, updateDto, userId);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Finalize and submit' })
  async finalizeSubmission(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.submissionsService.finalizeSubmission(id, userId);
  }

  @Get('team/:teamId')
  @ApiOperation({ summary: 'Get submissions for a team' })
  async getTeamSubmissions(@Param('teamId') teamId: string) {
    return this.submissionsService.getTeamSubmissions(teamId);
  }
}
