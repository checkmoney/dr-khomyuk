import { getDayOfYear, getDaysInYear, getDaysInMonth, getDay } from 'date-fns';
import { PeriodType, DateRange } from '@checkmoney/soap-opera';
import { Injectable } from '@nestjs/common';
import { last } from 'lodash';

import { endOfPreviousPeriod } from './utils/endOfPreviousPeriod';
import { PeriodAmountCalculator } from './PeriodAmountCalculator';
import { AverageCalculator } from './AverageCalculator';
import { Grow } from '../dto/Grow';

@Injectable()
export class GrowCalculator {
  constructor(
    private readonly average: AverageCalculator,
    private readonly periods: PeriodAmountCalculator,
  ) {}

  async calculate(userId: string, periodType: PeriodType) {
    const [average, thisPeriod] = await Promise.all([
      this.average.calculate(userId, periodType),
      this.getThisPeriod(userId, periodType),
    ]);

    const progress = this.getPeriodProgress(periodType);

    return new Grow(
      this.getGrowPercentage(
        Number(thisPeriod.expenses) * progress,
        Number(average.expenses),
      ),
      this.getGrowPercentage(
        Number(thisPeriod.earnings) * progress,
        Number(average.earnings),
      ),
    );
  }

  private getGrowPercentage(actual: number, average: number): number | null {
    if (actual === 0 || average === 0) {
      return null;
    }

    const decrease = actual - average;

    return (decrease / average) * 100;
  }

  private getPeriodProgress(periodType: PeriodType): number {
    const now = new Date();

    switch (periodType) {
      case PeriodType.Year:
        return getDayOfYear(now) / getDaysInYear(now);
      case PeriodType.Month:
        return now.getDate() / getDaysInMonth(now);
      case PeriodType.Week:
        return getDay(now) / 7;
      default:
        return 1;
    }
  }

  private async getThisPeriod(userId: string, periodType: PeriodType) {
    const range = new DateRange(endOfPreviousPeriod(periodType), new Date());

    const periods = await this.periods.calculate(userId, range, periodType);
    const thisPeriod = last(periods);

    if (!thisPeriod) {
      throw new Error('Logic exception');
    }

    return thisPeriod;
  }
}
