import { DatePeriod } from './DatePeriod';
import { TransformBigInt } from '&app/core/infrastructure/TransformBigInt';
import { ApiProperty } from '@nestjs/swagger';

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

export class PeriodCategories {
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
    this.expenses = expenses;
    this.earnings = earnings;
    this.period = period;
  }
}
