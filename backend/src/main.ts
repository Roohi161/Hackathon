import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global route prefix
  app.setGlobalPrefix('api/v1');

  // Enable CORS
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger API Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Hackathon Central API')
    .setDescription(
      'REST API documentation for Hackathon Central — managing hackathon events, teams, submissions, judging, and announcements.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter your JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'User registration and login')
    .addTag('Users', 'User profile and role management')
    .addTag('Hackathons', 'Hackathon event CRUD operations')
    .addTag('Teams', 'Team creation, joining, and management')
    .addTag('Submissions', 'Project submission endpoints')
    .addTag('Judging', 'Rubrics, scoring, and leaderboards')
    .addTag('Announcements', 'Live event announcements')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT) || 5000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Hackathon Central Backend running on: http://localhost:${port}/api/v1`);
  console.log(`📄 Swagger API Docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();
