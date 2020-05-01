import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { ConfigModule } from './config.module';
import { PlatformModule } from './platform/platform.module';
import { SnapshotManager } from './core/infrastructure/SnapshotManager';
import { SnapshotFinder } from './core/infrastructure/SnapshotFinder';
import { TransactionSynchronizer } from './core/application/TransactionSynchronizer';
import { typeOrmProvider } from './external/typeOrmProvider';
import { TransactionSnapshot } from './core/domain/TransactionSnapshot.entity';
import { CurrencySynchronizer } from './core/application/CurrencySynchronizer';
import { TriggerController } from './core/presentation/http/TriggerController';
import { bullProvider } from './external/bullProvider';
import { CURRENCY_QUEUE, TRANSACTION_QUEUE } from './external/constants';
import { DefaultCurrencyProcessor } from './core/presentation/queue/DefaultCurrencyProcessor';
import { TransactionProcessor } from './core/presentation/queue/TransactionProcessor';
import { StatisticsController } from './core/presentation/http/StatisticsController';
import { PeriodGrouper } from './core/domain/PeriodGrouper';
import { AverageCalculator } from './core/domain/calculator/AverageCalculator';
import { PeriodAmountCalculator } from './core/domain/calculator/PeriodAmountCalculator';
import { CategoryCalculator } from './core/domain/calculator/CategoryCalculator';

@Module({
  imports: [
    ConfigModule,
    PlatformModule,
    BullModule.registerQueueAsync(bullProvider(CURRENCY_QUEUE)),
    BullModule.registerQueueAsync(bullProvider(TRANSACTION_QUEUE)),
    TypeOrmModule.forRootAsync(typeOrmProvider),
    TypeOrmModule.forFeature([TransactionSnapshot]),
  ],
  controllers: [TriggerController, StatisticsController],
  providers: [
    PeriodGrouper,
    PeriodAmountCalculator,
    CategoryCalculator,
    AverageCalculator,
    SnapshotManager,
    SnapshotFinder,
    CurrencySynchronizer,
    TransactionSynchronizer,
    DefaultCurrencyProcessor,
    TransactionProcessor,
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
