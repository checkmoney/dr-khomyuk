import { TransformBigInt } from '&app/core/infrastructure/TransformBigInt';
import { ApiProperty } from '@nestjs/swagger';
import { DatePeriod } from './DatePeriod';

export class PeriodAmount {
  @TransformBigInt()
  @ApiProperty({ example: '20000', type: 'string' })
  readonly expenses: bigint;

  @TransformBigInt()
  @ApiProperty({ example: '35000', type: 'string' })
  readonly earnings: bigint;

  @ApiProperty({ type: DatePeriod })
  readonly period: DatePeriod;

  constructor(period: DatePeriod, expenses: bigint, earnings: bigint) {
    this.period = period;
    this.expenses = expenses;
    this.earnings = earnings;
  }
}
