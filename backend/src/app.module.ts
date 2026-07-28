import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HackathonsModule } from './modules/hackathons/hackathons.module';
import { TeamsModule } from './modules/teams/teams.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { JudgingModule } from './modules/judging/judging.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { NotificationsGateway } from './gateways/notifications.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    HackathonsModule,
    TeamsModule,
    SubmissionsModule,
    JudgingModule,
    AnnouncementsModule,
  ],
  controllers: [],
  providers: [NotificationsGateway],
})
export class AppModule {}
