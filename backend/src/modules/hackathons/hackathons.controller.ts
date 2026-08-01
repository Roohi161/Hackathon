import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HackathonsService } from './hackathons.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateHackathonDto, UpdateHackathonDto } from './dto/hackathons.dto';

@ApiTags('Hackathons')
@Controller('hackathons')
export class HackathonsController {
  constructor(private readonly hackathonsService: HackathonsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all hackathons' })
  async findAll(@Query('skip') skip?: number, @Query('take') take?: number, @Query('search') search?: string) {
    return this.hackathonsService.findAll(Number(skip) || 0, Number(take) || 10, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a hackathon by ID' })
  async findOne(@Param('id') id: string) {
    return this.hackathonsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ORGANIZER')
  @ApiOperation({ summary: 'Create a hackathon' })
  async create(@Body() createDto: CreateHackathonDto) {
    return this.hackathonsService.create(createDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ORGANIZER')
  @ApiOperation({ summary: 'Update a hackathon' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateHackathonDto) {
    return this.hackathonsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ORGANIZER')
  @ApiOperation({ summary: 'Delete a hackathon' })
  async remove(@Param('id') id: string) {
    return this.hackathonsService.remove(id);
  }

  @Post(':id/clone')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ORGANIZER')
  @ApiOperation({ summary: 'Clone a hackathon' })
  async clone(@Param('id') id: string) {
    return this.hackathonsService.clone(id);
  }
}
