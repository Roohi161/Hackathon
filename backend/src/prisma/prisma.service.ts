import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('✅ Prisma connected to database');
    } catch (e: any) {
      this.logger.warn(`⚠️ Database connection warning (${e?.message || 'PostgreSQL offline'}). NestJS API server running.`);
    }

    // Soft delete middleware — automatically filter deleted records
    this.$use(async (params, next) => {
      const modelsWithSoftDelete = [
        'User',
        'Hackathon',
        'Team',
        'Submission',
      ];

      if (modelsWithSoftDelete.includes(params.model ?? '')) {
        // For find operations, exclude soft-deleted records by default
        if (params.action === 'findMany' || params.action === 'findFirst') {
          if (!params.args) {
            params.args = {};
          }
          if (!params.args.where) {
            params.args.where = {};
          }
          // Only add deletedAt filter if not explicitly querying for deleted items
          if (params.args.where.deletedAt === undefined) {
            params.args.where.deletedAt = null;
          }
        }

        // Convert delete to soft delete
        if (params.action === 'delete') {
          params.action = 'update';
          params.args.data = { deletedAt: new Date() };
        }

        // Convert deleteMany to soft delete
        if (params.action === 'deleteMany') {
          params.action = 'updateMany';
          if (!params.args) {
            params.args = {};
          }
          params.args.data = { deletedAt: new Date() };
        }
      }

      return next(params);
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('🔌 Prisma disconnected from database');
  }

  /**
   * Clean the database — for testing only
   */
  async cleanDatabase(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('cleanDatabase is only allowed in test environment');
    }

    const models = Reflect.ownKeys(this)
      .filter((key) => typeof key === 'string' && !key.startsWith('_') && !key.startsWith('$'))
      .filter((key) => typeof (this as Record<string, unknown>)[key as string] === 'object');

    for (const modelKey of models) {
      const model = (this as Record<string, unknown>)[modelKey as string] as {
        deleteMany?: () => Promise<unknown>;
      };
      if (model?.deleteMany) {
        await model.deleteMany();
      }
    }
  }
}
