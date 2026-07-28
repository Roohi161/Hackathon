import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAnnouncementDto) {
    return this.prisma.announcement.create({
      data: {
        title: dto.title,
        content: dto.content,
        hackathonId: dto.hackathonId,
      },
    });
  }

  async findByHackathon(hackathonId: string) {
    return this.prisma.announcement.findMany({
      where: { hackathonId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
