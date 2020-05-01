import { PeriodType } from '@checkmoney/soap-opera';
import { Controller, Get } from '@nestjs/common';

import { AverageCalculator } from '&app/core/domain/AverageCalculator';

@Controller('v1/statistics')
export class StatisticsController {
  constructor(private readonly averageCalculator: AverageCalculator) {}

  @Get('average')
  async fetchAverage() {
    const {
      earnings,
      expenses,
    } = await this.averageCalculator.calculateAverage(
      'igor@kamyshev.me',
      PeriodType.Week,
    );

    return {
      expenses: expenses.toString(),
      earnings: earnings.toString(),
    };
  }
}
