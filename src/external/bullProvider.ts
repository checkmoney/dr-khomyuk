import { BullModuleAsyncOptions } from '@nestjs/bull';
import { Configuration } from '@solid-soda/config';

import { ConfigModule } from '&app/config.module';

export const bullProvider = (name: string): BullModuleAsyncOptions => ({
  name,
  useFactory: (config: Configuration) => {
    return {
      redis: {
        host: config.getStringOrThrow('REDIS_HOST'),
        port: config.getNumberOrThrow('REDIS_PORT'),
        user: config.getStringOrElse('REDIS_USER', ''),
        password: config.getStringOrElse('REDIS_PASSWORD', ''),
      },
    };
  },
  inject: [Configuration],
  imports: [ConfigModule],
});
