import { Module } from '@nestjs/common';
import { Configuration, CommonConfiguration } from '@solid-soda/config';
import path from 'path';

@Module({
  providers: [
    {
      provide: Configuration,
      useFactory: () =>
        new CommonConfiguration(path.resolve(__dirname, '../.env')),
    },
  ],
  exports: [Configuration],
})
export class ConfigModule {}
