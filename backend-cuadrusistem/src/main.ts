import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/application/parser/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // Enable CORS for development
  app.enableCors({
    origin: 'http://localhost:5173', // Assuming frontend runs on Vite's default port
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
