import { ApiProperty } from '@nestjs/swagger';

import { TransformBigInt } from '&app/core/infrastructure/TransformBigInt';

export class Average {
  @TransformBigInt()
  @ApiProperty({ example: '20000', type: 'string' })
  readonly expenses: bigint;

  @TransformBigInt()
  @ApiProperty({ example: '35000', type: 'string' })
  readonly earnings: bigint;

  constructor(expenses: bigint, earnings: bigint) {
    this.expenses = expenses;
    this.earnings = earnings;
  }
}
