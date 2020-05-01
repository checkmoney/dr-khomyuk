import { DateRange, PeriodType } from '@checkmoney/soap-opera';

import { PeriodGrouper } from './PeriodGrouper';
import { SnapshotFinder } from '../infrastructure/SnapshotFinder';
import { NormalizedTransaction } from './dto/NormalizedTransaction';
import { Injectable } from '@nestjs/common';

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
        expenses: expenses.map(this.toAmount).reduce(this.summarize, 0n),
        earnings: earnings.map(this.toAmount).reduce(this.summarize, 0n),
      }));
  }

  private toAmount = ({ amount }: NormalizedTransaction) => amount;

  private summarize = (prev: bigint, curr: bigint) => prev + curr;
}
