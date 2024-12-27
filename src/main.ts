import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform/transform.interceptor';
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new TransformInterceptor());

  const configService = app.get(ConfigService);
  const corsOrigins = configService
    .get<string>('CORS_ORIGINS', '')
    .split(',')
    .map((origin) => origin.trim());
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
