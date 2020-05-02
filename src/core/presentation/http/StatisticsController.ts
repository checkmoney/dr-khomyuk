import { PeriodType, DateRange, TokenPayload } from '@checkmoney/soap-opera';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { startOfYear, endOfYear } from 'date-fns';

import { AverageCalculator } from '&app/core/domain/calculator/AverageCalculator';
import { PeriodAmountCalculator } from '&app/core/domain/calculator/PeriodAmountCalculator';
import { CategoryCalculator } from '&app/core/domain/calculator/CategoryCalculator';

import { AuthGuard } from './AuthGuard';
import { CurrentUser } from './CurrentUser';

const mapper = (t) => ({
  category: t.category,
  amount: t.amount.toString(),
});

@Controller('v1/statistics')
@UseGuards(AuthGuard)
export class StatisticsController {
  constructor(
    private readonly average: AverageCalculator,
    private readonly periodAmount: PeriodAmountCalculator,
    private readonly categories: CategoryCalculator,
  ) {}

  @Get('average')
  async fetchAverage(@CurrentUser() user: TokenPayload) {
    const { earnings, expenses } = await this.average.calculate(
      user.login,
      PeriodType.Week,
    );

    return {
      expenses: expenses.toString(),
      earnings: earnings.toString(),
    };
  }

  @Get('periods')
  async fetchPeriods(@CurrentUser() user: TokenPayload) {
    const range = new DateRange(startOfYear(new Date()), endOfYear(new Date()));
    const sums = await this.periodAmount.calculate(
      user.login,
      range,
      PeriodType.Month,
    );

    return sums.map((sum) => ({
      period: sum.period,
      earnings: sum.earnings.toString(),
      expenses: sum.expenses.toString(),
    }));
  }

  @Get('categories')
  async fetchCategories(@CurrentUser() user: TokenPayload) {
    const range = new DateRange(startOfYear(new Date()), endOfYear(new Date()));
    const groups = await this.categories.calculate(
      user.login,
      range,
      PeriodType.Month,
    );

    return groups.map((group) => ({
      period: group.period,
      earnings: group.earnings.map(mapper),
      expenses: group.expenses.map(mapper),
    }));
  }
}
