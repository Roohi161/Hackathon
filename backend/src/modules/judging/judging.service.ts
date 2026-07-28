import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRubricDto } from './dto/create-rubric.dto';
import { SubmitScoreDto } from './dto/submit-score.dto';

@Injectable()
export class JudgingService {
  constructor(private prisma: PrismaService) {}

  async createRubric(dto: CreateRubricDto) {
    return this.prisma.rubric.create({
      data: {
        criteriaName: dto.criteriaName,
        weight: dto.weight || 1,
        hackathonId: dto.hackathonId,
      },
    });
  }

  async getRubricsByHackathon(hackathonId: string) {
    return this.prisma.rubric.findMany({
      where: { hackathonId },
    });
  }

  async submitScore(judgeId: string, dto: SubmitScoreDto) {
    return this.prisma.score.create({
      data: {
        value: dto.value,
        feedback: dto.feedback || null,
        judgeId,
        submissionId: dto.submissionId,
        rubricId: dto.rubricId,
      },
      include: {
        rubric: true,
        judge: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async getLeaderboard(hackathonId: string) {
    const submissions = await this.prisma.submission.findMany({
      where: { hackathonId },
      include: {
        team: true,
        scores: {
          include: { rubric: true },
        },
      },
    });

    const leaderboard = submissions.map((submission) => {
      let totalWeightedScore = 0;
      let totalWeight = 0;

      submission.scores.forEach((score) => {
        const weight = score.rubric?.weight || 1;
        totalWeightedScore += score.value * weight;
        totalWeight += weight;
      });

      const finalScore = totalWeight > 0 ? (totalWeightedScore / totalWeight).toFixed(2) : '0.00';

      return {
        submissionId: submission.id,
        title: submission.title,
        teamName: submission.team.name,
        githubUrl: submission.githubUrl,
        videoDemoUrl: submission.videoDemoUrl,
        finalScore: parseFloat(finalScore),
        scoreCount: submission.scores.length,
      };
    });

    return leaderboard.sort((a, b) => b.finalScore - a.finalScore);
  }
}
