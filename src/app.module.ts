import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}