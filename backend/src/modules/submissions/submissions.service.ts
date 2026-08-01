import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubmissionDto, UpdateSubmissionDto } from './dto/submissions.dto';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async createDraft(dto: CreateSubmissionDto, userId: string) {
    // Check if team exists and user is member
    return this.prisma.submission.create({
      data: {
        teamId: dto.teamId,
        hackathonId: dto.hackathonId,
        title: dto.title,
        description: dto.description,
        status: 'DRAFT',
        submittedById: userId
      } as any
    });
  }

  async updateDraft(id: string, dto: UpdateSubmissionDto, userId: string) {
    const submission = await this.prisma.submission.findFirst({ where: { id } });
    if (!submission) throw new NotFoundException('Submission not found');
    if ((submission as any).status !== 'DRAFT') throw new ForbiddenException('Cannot edit non-draft submission');

    return this.prisma.submission.update({
      where: { id },
      data: dto as any
    });
  }

  async finalizeSubmission(id: string, userId: string) {
    const submission = await this.prisma.submission.findFirst({ where: { id } });
    if (!submission) throw new NotFoundException('Submission not found');
    
    return this.prisma.submission.update({
      where: { id },
      data: { status: 'SUBMITTED', submittedAt: new Date() } as any
    });
  }

  async getTeamSubmissions(teamId: string) {
    return this.prisma.submission.findMany({ where: { teamId } as any });
  }
}
