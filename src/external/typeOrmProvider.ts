import { Configuration } from '@solid-soda/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join, dirname } from 'path';
import { readFileSync } from 'fs';

import { ConfigModule } from '&app/config.module';

export const typeOrmProvider: TypeOrmModuleAsyncOptions = {
  useFactory: (config: Configuration) => {
    const certPath = join(
      dirname(process.cwd()),
      '.secure',
      'ca-certificate.txt',
    );

    const createSslConfig = this.config.isProd()
      ? () => ({ ca: readFileSync(certPath) })
      : () => undefined;

    return {
      type: 'postgres',
      host: config.getStringOrThrow('DB_HOST'),
      port: config.getNumberOrThrow('DB_PORT'),
      username: config.getStringOrThrow('DB_USER'),
      password: config.getStringOrThrow('DB_PASSWORD'),
      database: config.getStringOrThrow('DB_NAME'),
      entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
      synchronize: false,
      ssl: createSslConfig(),
    };
  },
  inject: [Configuration],
  imports: [ConfigModule],
};
