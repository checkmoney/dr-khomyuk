import { ApiPropertyOptional } from '@nestjs/swagger';
import { Grow as BaseGrow } from '@checkmoney/soap-opera';

export class Grow extends BaseGrow {
  @ApiPropertyOptional({ example: '88' })
  readonly expenses: number | null;

  @ApiPropertyOptional({ example: '-3' })
  readonly earnings: number | null;

  constructor(expenses: number | null, earnings: number | null) {
    super();
    this.expenses = expenses;
    this.earnings = earnings;
  }
}
