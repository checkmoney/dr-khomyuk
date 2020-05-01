import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from './config.module';
import { PlatformModule } from './platform/platform.module';
import { SnapshotManager } from './core/infrastructure/SnapshotManager';
import { SnapshotFinder } from './core/infrastructure/SnapshotFinder';
import { TransactionSynchronizer } from './core/application/TransactionSynchronizer';
import { typeOrmProvider } from './external/typeOrmProvider';
import { TransactionSnapshot } from './core/domain/TransactionSnapshot.entity';

@Module({
  imports: [
    ConfigModule,
    PlatformModule,
    TypeOrmModule.forRootAsync(typeOrmProvider),
    TypeOrmModule.forFeature([TransactionSnapshot]),
  ],
  controllers: [],
  providers: [SnapshotManager, SnapshotFinder, TransactionSynchronizer],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
