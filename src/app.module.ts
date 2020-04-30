import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { ConfigModule } from './config.module';
import { PlatformModule } from './platform/platform.module';

@Module({
  imports: [ConfigModule, PlatformModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
