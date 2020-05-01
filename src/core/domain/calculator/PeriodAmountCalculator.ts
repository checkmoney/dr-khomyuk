import { DateRange, PeriodType } from '@checkmoney/soap-opera';
import { Injectable } from '@nestjs/common';

import { PeriodGrouper } from '../PeriodGrouper';
import { SnapshotFinder } from '../../infrastructure/SnapshotFinder';
import { toAmount, summarize } from './helpers';

@Injectable()
export class PeriodAmountCalculator {
  constructor(
    private readonly grouper: PeriodGrouper,
    private readonly finder: SnapshotFinder,
  ) {}

  async calculate(
    userId: string,
    dateRange: DateRange,
    periodType: PeriodType,
  ) {
    const transactions = await this.finder.fetchByRange(userId, dateRange);

    return this.grouper
      .groupHistoryByPeriods(transactions, periodType, dateRange)
      .map(({ expenses, earnings, period }) => ({
        period,
        expenses: expenses.map(toAmount).reduce(summarize, 0n),
        earnings: earnings.map(toAmount).reduce(summarize, 0n),
      }));
  }
}
