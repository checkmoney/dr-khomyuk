import { PeriodType, DateRange } from '@checkmoney/soap-opera';
import { Injectable } from '@nestjs/common';

import { SnapshotFinder } from '../../infrastructure/SnapshotFinder';
import { PeriodAmountCalculator } from './PeriodAmountCalculator';
import { endOfPreviousPeriod } from './utils/endOfPreviousPeriod';
import { Average } from '../dto/Average';

@Injectable()
export class AverageCalculator {
  constructor(
    private readonly periodAmount: PeriodAmountCalculator,
    private readonly finder: SnapshotFinder,
  ) {}

  async calculate(userId: string, periodType: PeriodType) {
    const from = await this.finder.findEarliestDate(userId);
    const to = endOfPreviousPeriod(periodType);

    const range = new DateRange(from, to);

    const sums = await this.periodAmount.calculate(userId, range, periodType);

    const expenses = sums
      .map((item) => item.expenses)
      .filter(Boolean)
      .reduce(this.createAverageReducer(), 0n);
    const earnings = sums
      .map((item) => item.earnings)
      .filter(Boolean)
      .reduce(this.createAverageReducer(), 0n);

    return new Average(expenses, earnings);
  }

  private createAverageReducer = () =>
    ((sum: bigint, count: bigint) => (_: bigint, amount: bigint) => {
      // eslint-disable-next-line no-param-reassign
      sum += amount;
      // eslint-disable-next-line no-param-reassign
      count += 1n;

      return sum / count;
    })(0n, 0n);
}
