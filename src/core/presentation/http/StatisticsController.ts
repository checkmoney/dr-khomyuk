import { PeriodType, DateRange } from '@checkmoney/soap-opera';
import { Controller, Get } from '@nestjs/common';
import { startOfYear, endOfYear } from 'date-fns';

import { AverageCalculator } from '&app/core/domain/AverageCalculator';
import { PeriodAmountCalculator } from '&app/core/domain/PeriodAmountCalculator';

@Controller('v1/statistics')
export class StatisticsController {
  constructor(
    private readonly average: AverageCalculator,
    private readonly periodAmount: PeriodAmountCalculator,
  ) {}

  @Get('average')
  async fetchAverage() {
    const { earnings, expenses } = await this.average.calculate(
      'igor@kamyshev.me',
      PeriodType.Week,
    );

    return {
      expenses: expenses.toString(),
      earnings: earnings.toString(),
    };
  }

  @Get('periods')
  async findPeriods() {
    const range = new DateRange(startOfYear(new Date()), endOfYear(new Date()));
    const sums = await this.periodAmount.calculate(
      'igor@kamyshev.me',
      range,
      PeriodType.Month,
    );

    return sums.map((sum) => ({
      period: sum.period,
      earnings: sum.earnings.toString(),
      expenses: sum.expenses.toString(),
    }));
  }
}
