import { BullModuleAsyncOptions } from '@nestjs/bull';
import { Configuration } from '@solid-soda/config';

import { ConfigModule } from '&app/config.module';

export const bullProvider = (name: string): BullModuleAsyncOptions => ({
  name,
  useFactory: (config) => {
    // TODO: use config
    return {
      redis: {
        host: 'localhost',
        port: 6379,
      },
    };
  },
  inject: [Configuration],
  imports: [ConfigModule],
});
