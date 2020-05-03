import { ApiProperty } from '@nestjs/swagger';
import {
  Average as BaseAverage,
  TransformBigInt,
} from '@checkmoney/soap-opera';

export class Average extends BaseAverage {
  @TransformBigInt()
  @ApiProperty({ example: '20000', type: 'string' })
  readonly expenses: bigint;

  @TransformBigInt()
  @ApiProperty({ example: '35000', type: 'string' })
  readonly earnings: bigint;

  constructor(expenses: bigint, earnings: bigint) {
    super();

    this.expenses = expenses;
    this.earnings = earnings;
  }
}
