import { PeriodType, DateRange } from '@checkmoney/soap-opera';
import {
  endOfYear,
  subYears,
  endOfMonth,
  subMonths,
  subWeeks,
  endOfWeek,
  endOfDay,
  subDays,
} from 'date-fns';
import { Injectable } from '@nestjs/common';

import { PeriodGrouper } from './PeriodGrouper';
import { SnapshotFinder } from '../infrastructure/SnapshotFinder';
import { NormalizedTransaction } from './dto/NormalizedTransaction';

@Injectable()
export class AverageCalculator {
  constructor(
    private readonly grouper: PeriodGrouper,
    private readonly finder: SnapshotFinder,
  ) {}

  async calculateAverage(userId: string, periodType: PeriodType) {
    const from = await this.finder.findEarliestDate(userId);
    const to = this.endOfPreviousPeriod(periodType);

    const range = new DateRange(from, to);

    const transactions = await this.finder.fetchByRange(userId, range);

    const sums = this.grouper
      .groupHistoryByPeriods(transactions, periodType, range)
      .map(({ expenses, earnings }) => ({
        expenses: expenses.map(this.toAmount).reduce(this.summarize, 0n),
        earnings: earnings.map(this.toAmount).reduce(this.summarize, 0n),
      }));

    return {
      expenses: sums
        .map((item) => item.expenses)
        .filter(Boolean)
        .reduce(this.createAverageReducer(), 0n),
      earnings: sums
        .map((item) => item.earnings)
        .filter(Boolean)
        .reduce(this.createAverageReducer(), 0n),
    };
  }

  private toAmount = ({ amount }: NormalizedTransaction) => amount;

  private summarize = (prev: bigint, curr: bigint) => prev + curr;

  private createAverageReducer = () =>
    ((sum: bigint, count: bigint) => (_: bigint, amount: bigint) => {
      sum += amount;
      count++;

      return sum / count;
    })(0n, 0n);

  private endOfPreviousPeriod = (periodType: PeriodType): Date => {
    const now = new Date();

    switch (periodType) {
      case PeriodType.Year:
        return endOfYear(subYears(now, 1));
      case PeriodType.Month:
        return endOfMonth(subMonths(now, 1));
      case PeriodType.Week:
        return endOfWeek(subWeeks(now, 1));
      case PeriodType.Day:
        return endOfDay(subDays(now, 1));
    }
  };
}
