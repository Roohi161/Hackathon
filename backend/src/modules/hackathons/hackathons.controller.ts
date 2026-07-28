import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HackathonsService } from './hackathons.service';
import { CreateHackathonDto } from './dto/create-hackathon.dto';
import { UpdateHackathonDto } from './dto/update-hackathon.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Hackathons')
@Controller('hackathons')
export class HackathonsController {
  constructor(private readonly hackathonsService: HackathonsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new hackathon (Organizer/Admin)' })
  async create(
    @CurrentUser('id') organizerId: string,
    @Body() dto: CreateHackathonDto,
  ) {
    return this.hackathonsService.create(organizerId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all hackathons (optional filter by status)' })
  async findAll(@Query('status') status?: string) {
    return this.hackathonsService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hackathon by ID' })
  async findOne(@Param('id') id: string) {
    return this.hackathonsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update hackathon (Organizer/Admin)' })
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateHackathonDto,
  ) {
    return this.hackathonsService.update(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete hackathon (Organizer/Admin)' })
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.hackathonsService.remove(id, userId);
  }
}
