import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AssignJudgeDto, SubmitScoreDto } from './dto/judging.dto';

@Injectable()
export class JudgingService {
  constructor(private prisma: PrismaService) {}

  async assignJudge(dto: AssignJudgeDto) {
    // Check if already assigned
    const existing = await this.prisma.judgeAssignment.findFirst({
      where: { judgeId: dto.judgeId, submissionId: dto.submissionId } as any
    });
    if (existing) throw new ConflictException('Judge already assigned to this submission');

    return this.prisma.judgeAssignment.create({
      data: {
        judgeId: dto.judgeId,
        submissionId: dto.submissionId,
        status: 'PENDING'
      } as any
    });
  }

  async submitScore(submissionId: string, judgeId: string, dto: SubmitScoreDto) {
    const assignment = await this.prisma.judgeAssignment.findFirst({
      where: { judgeId, submissionId } as any
    });
    
    if (!assignment) throw new NotFoundException('You are not assigned to this submission');

    // Create scores using transaction
    return this.prisma.$transaction(async (tx) => {
      for (const score of dto.scores) {
        await tx.score.create({
          data: {
            submissionId,
            judgeId,
            criteriaId: score.criteriaId,
            value: score.score
          } as any
        });
      }

      return tx.judgeAssignment.update({
        where: { id: (assignment as any).id },
        data: { status: 'COMPLETED', feedback: dto.feedback } as any
      });
    });
  }

  async getLeaderboard(hackathonId: string) {
    // Get all submissions for hackathon
    const submissions = await this.prisma.submission.findMany({
      where: { hackathonId, status: 'SUBMITTED' } as any,
      include: {
        scores: true
      } as any
    });

    const leaderboard = submissions.map(sub => {
      const allScores = (sub as any).scores || [];
      const totalScore = allScores.reduce((acc: any, curr: any) => acc + (curr.value || curr.score || 0), 0);
      const normalizedScore = allScores.length > 0 ? totalScore / allScores.length : 0;
      
      return {
        id: sub.id,
        title: sub.title,
        teamId: sub.teamId,
        totalScore,
        normalizedScore
      };
    });

    return leaderboard.sort((a, b) => b.normalizedScore - a.normalizedScore);
  }
}
