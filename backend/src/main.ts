import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { generateChunkFiles } from './infra/local-file/videotohlschunks';
import { SocketIOAdapter } from './socket-io-adapter';

async function bootstrap() {
  const logger = new Logger('Main (main.ts)');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const whitelist = configService.get('FRONTEND_URL').split(',');
  const port = parseInt(configService.get('APP_PORT'));

  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE',
  });

  const config = new DocumentBuilder()
    .setTitle('Elearning')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.useStaticAssets(join(__dirname, '../', '/public'));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await generateChunkFiles();
  app.useWebSocketAdapter(new SocketIOAdapter(app));

  await app.listen(port);
  logger.log(`Server running on port ${port}`);
}
bootstrap();
