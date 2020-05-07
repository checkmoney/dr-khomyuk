import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from '&app/app.module';

import { setupSwagger } from './external/setupSwagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true },
  );

  setupSwagger(app, 'docs');

  await app.listen(3000, '0.0.0.0');
}

bootstrap();
