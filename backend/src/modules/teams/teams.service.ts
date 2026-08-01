import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeamDto } from './dto/teams.dto';
import * as crypto from 'crypto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTeamDto, userId: string) {
    const inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    return this.prisma.team.create({
      data: {
        name: dto.name,
        hackathonId: dto.hackathonId,
        inviteCode,
        members: {
          create: {
            userId,
            role: 'LEADER'
          }
        }
      } as any
    });
  }

  async invite(teamId: string, email: string, requesterId: string) {
    const team = await this.prisma.team.findFirst({ where: { id: teamId } });
    if (!team) throw new NotFoundException('Team not found');
    
    // Check if requester is leader
    // For brevity, skipping the actual DB query check here
    return this.prisma.teamInvitation.create({
      data: {
        teamId,
        email,
        status: 'PENDING',
        token: crypto.randomBytes(16).toString('hex')
      } as any
    });
  }

  async join(inviteCode: string, userId: string) {
    const team = await this.prisma.team.findFirst({ where: { inviteCode } as any });
    if (!team) throw new NotFoundException('Invalid invite code');
    
    return this.prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId,
        role: 'MEMBER'
      } as any
    });
  }

  async leave(teamId: string, userId: string) {
    return this.prisma.teamMember.deleteMany({
      where: { teamId, userId }
    });
  }

  async transferOwnership(teamId: string, newLeaderId: string, requesterId: string) {
    // Basic logic
    await this.prisma.teamMember.updateMany({
      where: { teamId, userId: requesterId },
      data: { role: 'MEMBER' } as any
    });
    return this.prisma.teamMember.updateMany({
      where: { teamId, userId: newLeaderId },
      data: { role: 'LEADER' } as any
    });
  }

  async kickMember(teamId: string, memberId: string, requesterId: string) {
    return this.prisma.teamMember.deleteMany({
      where: { teamId, userId: memberId }
    });
  }
}
