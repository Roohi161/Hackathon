import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnnouncementsService } from './announcements.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateAnnouncementDto } from './dto/announcements.dto';

@ApiTags('Announcements')
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ORGANIZER')
  @ApiOperation({ summary: 'Create an announcement' })
  async create(@Body() createDto: CreateAnnouncementDto, @CurrentUser('id') userId: string) {
    return this.announcementsService.create(createDto, userId);
  }

  @Get('hackathon/:id')
  @ApiOperation({ summary: 'Get announcements for a hackathon' })
  async getByHackathon(@Param('id') hackathonId: string) {
    return this.announcementsService.getByHackathon(hackathonId);
  }
}
