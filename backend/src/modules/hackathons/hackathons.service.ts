import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHackathonDto } from './dto/create-hackathon.dto';
import { UpdateHackathonDto } from './dto/update-hackathon.dto';

@Injectable()
export class HackathonsService {
  constructor(private prisma: PrismaService) {}

  async create(organizerId: string, dto: CreateHackathonDto) {
    return this.prisma.hackathon.create({
      data: {
        title: dto.title,
        description: dto.description,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        status: dto.status || 'DRAFT',
        organizerId,
      },
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async findAll(status?: string) {
    const whereCondition = status ? { status } : {};
    return this.prisma.hackathon.findMany({
      where: whereCondition,
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { teams: true, submissions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const hackathon = await this.prisma.hackathon.findUnique({
      where: { id },
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        rubrics: true,
        announcements: { orderBy: { createdAt: 'desc' } },
        _count: { select: { teams: true, submissions: true } },
      },
    });

    if (!hackathon) {
      throw new NotFoundException('Hackathon not found');
    }

    return hackathon;
  }

  async update(id: string, userId: string, dto: UpdateHackathonDto) {
    const hackathon = await this.findOne(id);
    if (hackathon.organizerId !== userId) {
      throw new ForbiddenException('Only the hackathon organizer can update this event');
    }

    return this.prisma.hackathon.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description && { description: dto.description }),
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
        ...(dto.status && { status: dto.status }),
      },
    });
  }

  async remove(id: string, userId: string) {
    const hackathon = await this.findOne(id);
    if (hackathon.organizerId !== userId) {
      throw new ForbiddenException('Only the hackathon organizer can delete this event');
    }

    return this.prisma.hackathon.delete({ where: { id } });
  }
}
