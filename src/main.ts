import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform/transform.interceptor';
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new TransformInterceptor()); //clean null values in JSON

  // CORS config
  const configService = app.get(ConfigService);
  const corsOrigins = configService
    .get<string>('CORS_ORIGINS', '')
    .split(',')
    .map((origin) => origin.trim());
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Swagger
  // Warning SWAGGER_ROUTE must start with /
  if (configService.get<string>('SWAGGER_ROUTE', '') && configService.get<string>('SWAGGER_USER', '') && configService.get<string>('SWAGGER_PASSWORD', '')) {
    app.use( // Basic Authentication middleware to the Swagger route
      [configService.get<string>('SWAGGER_ROUTE', ''), `${configService.get<string>('SWAGGER_ROUTE', '')}-json`],
      basicAuth({
        users: {
          [configService.get<string>('SWAGGER_USER', '')]: configService.get<string>('SWAGGER_PASSWORD', ''),
        },
        challenge: true, // enables the browser prompt
      }),
    );
    const config = new DocumentBuilder()
      .setTitle('Clients')
      .setDescription('The clients API description')
      .setVersion(require('../package.json').version)
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(configService.get<string>('SWAGGER_ROUTE', ''), app, documentFactory);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
