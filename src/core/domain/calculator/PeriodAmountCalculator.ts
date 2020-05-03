import { DateRange, PeriodType } from '@checkmoney/soap-opera';
import { Injectable } from '@nestjs/common';

import { PeriodGrouper } from '../PeriodGrouper';
import { SnapshotFinder } from '../../infrastructure/SnapshotFinder';
import { toAmount, summarize } from './helpers';
import { PeriodAmount } from '../dto/PeriodAmount';

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
      .map(({ expenses, earnings, period }) => {
        const expensesSum = expenses.map(toAmount).reduce(summarize, 0n);
        const earningsSum = earnings.map(toAmount).reduce(summarize, 0n);

        return new PeriodAmount(period, expensesSum, earningsSum);
      });
  }
}
