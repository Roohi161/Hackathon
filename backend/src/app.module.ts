import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import { envValidationSchema } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HackathonsModule } from './modules/hackathons/hackathons.module';
import { TeamsModule } from './modules/teams/teams.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { JudgingModule } from './modules/judging/judging.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HealthModule } from './modules/health/health.module';
import { NotificationsGateway } from './gateways/notifications.gateway';

@Module({
  imports: [
    // Global configuration with validation
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: false,
      },
    }),

    // Rate limiting — 100 requests per 60 seconds per IP
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Core modules
    PrismaModule,

    // Feature modules
    AuthModule,
    UsersModule,
    HackathonsModule,
    TeamsModule,
    SubmissionsModule,
    JudgingModule,
    AnnouncementsModule,
    NotificationsModule,
    HealthModule,
  ],
  controllers: [],
  providers: [
    // Global rate limiting guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    NotificationsGateway,
  ],
})
export class AppModule {}
