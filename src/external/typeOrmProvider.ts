import { Configuration } from '@solid-soda/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join } from 'path';

import { ConfigModule } from '&app/config.module';

export const typeOrmProvider: TypeOrmModuleAsyncOptions = {
  useFactory: (config: Configuration) => {
    return {
      type: 'postgres',
      host: config.getStringOrThrow('DB_HOST'),
      port: config.getNumberOrThrow('DB_PORT'),
      username: config.getStringOrThrow('DB_USER'),
      password: config.getStringOrThrow('DB_PASSWORD'),
      database: config.getStringOrThrow('DB_NAME'),
      entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
      synchronize: true, // TODO: add evolutions
    };
  },
  inject: [Configuration],
  imports: [ConfigModule],
};
