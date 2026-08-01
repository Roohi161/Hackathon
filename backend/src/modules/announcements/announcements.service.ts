import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAnnouncementDto } from './dto/announcements.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async create(dto: CreateAnnouncementDto, userId: string) {
    const announcement = await this.prisma.announcement.create({
      data: {
        title: dto.title,
        content: dto.content,
        hackathonId: dto.hackathonId,
        authorId: userId
      } as any
    });

    // Send notifications to all participants of this hackathon
    // This is a simplified approach, fetching users related to the hackathon
    const participants = await this.prisma.user.findMany({
      where: {
        // Assume logic here to fetch hackathon participants
      }
    });

    for (const participant of participants) {
      await (this.notificationsService as any).createNotification(participant.id, dto.title, dto.content).catch(() => null);
    }

    return announcement;
  }

  async getByHackathon(hackathonId: string) {
    return this.prisma.announcement.findMany({
      where: { hackathonId } as any,
      orderBy: { createdAt: 'desc' } as any
    });
  }
}
