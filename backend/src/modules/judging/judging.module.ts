import { Module } from '@nestjs/common';
import { JudgingService } from './judging.service';
import { JudgingController } from './judging.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [JudgingController],
  providers: [JudgingService],
  exports: [JudgingService],
})
export class JudgingModule {}
