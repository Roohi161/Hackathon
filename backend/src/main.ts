import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 5000);
  const corsOrigin = configService.get<string>('cors.origin', 'http://localhost:3002');
  const nodeEnv = configService.get<string>('nodeEnv', 'development');
  const logger = new Logger('Bootstrap');

  // Global route prefix
  app.setGlobalPrefix('api/v1');

  // Security middleware
  app.use(helmet());

  // CORS — properly configured
  app.enableCors({
    origin: corsOrigin.split(',').map((o: string) => o.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Request body size limit
  app.use(
    (
      _req: Record<string, unknown>,
      _res: Record<string, unknown>,
      next: () => void,
    ) => next(),
  );

  // Swagger API Documentation
  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Hackathon Central API')
      .setDescription(
        'Enterprise-grade REST API for the Hackathon Central platform — managing hackathon events, teams, submissions, judging, certificates, and communications.',
      )
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          description: 'Enter your JWT access token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Health', 'System health and status checks')
      .addTag('Auth', 'Authentication and authorization')
      .addTag('Users', 'User profiles and management')
      .addTag('Hackathons', 'Hackathon lifecycle management')
      .addTag('Teams', 'Team creation and management')
      .addTag('Submissions', 'Project submissions')
      .addTag('Judging', 'Evaluation, scoring, and leaderboards')
      .addTag('Announcements', 'Event announcements')
      .addTag('Notifications', 'User notifications')
      .addTag('Certificates', 'Certificate generation and verification')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
    logger.log(`📄 Swagger API Docs: http://localhost:${port}/api/docs`);
  }

  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 Hackathon Central API running on: http://localhost:${port}/api/v1`);
  logger.log(`🌍 Environment: ${nodeEnv}`);
  logger.log(`🔒 CORS Origin: ${corsOrigin}`);
}
bootstrap();
