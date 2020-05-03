import { ApiProperty } from '@nestjs/swagger';
import {
  PeriodCategories as BasePeriodCategories,
  TransformBigInt,
} from '@checkmoney/soap-opera';

import { DatePeriod } from './DatePeriod';

export class CategoryData {
  @TransformBigInt()
  @ApiProperty({ example: '30000', type: 'string' })
  readonly amount: bigint;

  @ApiProperty({ example: 'NASA' })
  readonly category: string;

  constructor(amount: bigint, category: string) {
    this.amount = amount;
    this.category = category;
  }
}

export class PeriodCategories extends BasePeriodCategories {
  @ApiProperty({ type: CategoryData, isArray: true })
  readonly expenses: CategoryData[];

  @ApiProperty({ type: CategoryData, isArray: true })
  readonly earnings: CategoryData[];

  @ApiProperty({ type: DatePeriod })
  readonly period: DatePeriod;

  constructor(
    expenses: CategoryData[],
    earnings: CategoryData[],
    period: DatePeriod,
  ) {
    super();

    this.expenses = expenses;
    this.earnings = earnings;
    this.period = period;
  }
}
