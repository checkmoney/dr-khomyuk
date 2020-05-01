import { MrButcher, MrSolomons, DetBell } from '@checkmoney/soap-opera';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { ConfigModule } from '&app/config.module';

import { mrButcherProvider } from './mrButcherProvider';
import { mrSolomonsProvider } from './mrSolomonsProvider';
import { detBellProvider } from './detBellProvider';

@Module({
  imports: [ConfigModule],
  providers: [mrButcherProvider, mrSolomonsProvider, detBellProvider],
  exports: [MrButcher, MrSolomons, DetBell],
})
export class PlatformModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
