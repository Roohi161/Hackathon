import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { JoinTeamDto } from './dto/join-team.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async createTeam(userId: string, dto: CreateTeamDto) {
    const hackathon = await this.prisma.hackathon.findUnique({
      where: { id: dto.hackathonId },
    });

    if (!hackathon) {
      throw new NotFoundException('Hackathon not found');
    }

    const existingMember = await this.prisma.teamMember.findFirst({
      where: {
        userId,
        team: { hackathonId: dto.hackathonId },
      },
    });

    if (existingMember) {
      throw new ConflictException('User is already in a team for this hackathon');
    }

    return this.prisma.team.create({
      data: {
        name: dto.name,
        hackathonId: dto.hackathonId,
        members: {
          create: {
            userId,
            isLeader: true,
          },
        },
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  }

  async joinTeam(userId: string, dto: JoinTeamDto) {
    const team = await this.prisma.team.findUnique({
      where: { id: dto.teamId },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const existingMemberInHackathon = await this.prisma.teamMember.findFirst({
      where: {
        userId,
        team: { hackathonId: team.hackathonId },
      },
    });

    if (existingMemberInHackathon) {
      throw new ConflictException('User is already in a team for this hackathon');
    }

    return this.prisma.teamMember.create({
      data: {
        userId,
        teamId: dto.teamId,
        isLeader: false,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        team: true,
      },
    });
  }

  async findByHackathon(hackathonId: string) {
    return this.prisma.team.findMany({
      where: { hackathonId },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        submissions: true,
      },
    });
  }

  async findOne(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        submissions: true,
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }
}
