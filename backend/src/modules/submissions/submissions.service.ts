import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateSubmissionDto) {
    const teamMember = await this.prisma.teamMember.findFirst({
      where: {
        userId,
        teamId: dto.teamId,
      },
    });

    if (!teamMember) {
      throw new ForbiddenException('You must be a member of the team to submit a project');
    }

    const existingSubmission = await this.prisma.submission.findFirst({
      where: { teamId: dto.teamId, hackathonId: dto.hackathonId },
    });

    if (existingSubmission) {
      throw new ConflictException('Team has already submitted a project for this hackathon');
    }

    return this.prisma.submission.create({
      data: {
        title: dto.title,
        description: dto.description,
        githubUrl: dto.githubUrl || null,
        videoDemoUrl: dto.videoDemoUrl || null,
        techStack: dto.techStack || [],
        teamId: dto.teamId,
        hackathonId: dto.hackathonId,
      },
      include: {
        team: {
          include: {
            members: { include: { user: { select: { id: true, name: true, email: true } } } },
          },
        },
      },
    });
  }

  async findByHackathon(hackathonId: string) {
    return this.prisma.submission.findMany({
      where: { hackathonId },
      include: {
        team: true,
        scores: {
          include: {
            rubric: true,
            judge: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        team: {
          include: {
            members: { include: { user: { select: { id: true, name: true, email: true } } } },
          },
        },
        scores: {
          include: {
            rubric: true,
            judge: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    return submission;
  }
}
