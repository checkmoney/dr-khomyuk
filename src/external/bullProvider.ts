import { BullModuleAsyncOptions } from '@nestjs/bull';
import { Configuration } from '@solid-soda/config';

import { ConfigModule } from '&app/config.module';

export const bullProvider = (name: string): BullModuleAsyncOptions => ({
  name,
  useFactory: (config: Configuration) => {
    const user = config.getStringOrElse('REDIS_USER', '');
    const password = config.getStringOrElse('REDIS_PASSWORD', '');
    const host = config.getStringOrThrow('REDIS_HOST');
    const port = config.getNumberOrThrow('REDIS_PORT');

    const prefix = config.isProd() ? 'rediss' : 'redis';

    return {
      redis: `${prefix}://${user}:${password}@${host}:${port}/`,
    };
  },
  inject: [Configuration],
  imports: [ConfigModule],
});
