import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Submissions')
@ApiBearerAuth('JWT-auth')
@Controller('submissions')
@UseGuards(JwtAuthGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a project for a hackathon' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateSubmissionDto) {
    return this.submissionsService.create(userId, dto);
  }

  @Get('hackathon/:hackathonId')
  @ApiOperation({ summary: 'Get all submissions for a hackathon' })
  async findByHackathon(@Param('hackathonId') hackathonId: string) {
    return this.submissionsService.findByHackathon(hackathonId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get submission by ID' })
  async findOne(@Param('id') id: string) {
    return this.submissionsService.findOne(id);
  }
}
