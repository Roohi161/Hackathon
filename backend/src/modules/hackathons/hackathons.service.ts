import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHackathonDto, UpdateHackathonDto } from './dto/hackathons.dto';

@Injectable()
export class HackathonsService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip: number, take: number, search?: string) {
    const where = search ? { title: { contains: search, mode: 'insensitive' as any } } : {};
    const [data, total] = await Promise.all([
      this.prisma.hackathon.findMany({ where, skip, take }),
      this.prisma.hackathon.count({ where }),
    ]);
    return { data, total, skip, take };
  }

  async findOne(id: string) {
    const hackathon = await this.prisma.hackathon.findFirst({ where: { id } });
    if (!hackathon) throw new NotFoundException('Hackathon not found');
    return hackathon;
  }

  async create(dto: CreateHackathonDto) {
    return this.prisma.hackathon.create({
      data: { ...dto, slug: (dto as any).slug || `hack-${Date.now()}`, status: 'DRAFT' } as any,
    });
  }

  async update(id: string, dto: UpdateHackathonDto) {
    const hackathon = await this.findOne(id);
    return this.prisma.hackathon.update({
      where: { id: hackathon.id },
      data: dto as any,
    });
  }

  async remove(id: string) {
    const hackathon = await this.findOne(id);
    return this.prisma.hackathon.delete({ where: { id: hackathon.id } });
  }

  async clone(id: string) {
    const hackathon = await this.findOne(id);
    const { id: oldId, createdAt, updatedAt, ...rest } = hackathon as any;
    return this.prisma.hackathon.create({
      data: { ...rest, title: `${rest.title} (Copy)`, status: 'DRAFT' },
    });
  }
}
