import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import helmet from '@fastify/helmet';
import { LoggerInterceptor } from './shared/interceptors/logger.interceptor';
import { AppModule } from './modules/app/app.module';
import { AllExceptionsFilter } from './shared/services/excepcion-filter.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
      ignoreTrailingSlash: true,
      bodyLimit: 12485760,
    }),
  );

  await app.register(helmet);

  app.enableCors({
    origin: '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(new LoggerInterceptor());

  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableShutdownHooks();

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port')!;
  await app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on ${port}`);
  });
}

bootstrap()
  .then(() => console.log('Server is running on port', ':)'))
  .catch((e) => console.log(e));
