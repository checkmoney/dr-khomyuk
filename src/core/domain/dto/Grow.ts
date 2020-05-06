import { ApiPropertyOptional } from '@nestjs/swagger';

export class Grow {
  @ApiPropertyOptional({ example: '88' })
  readonly expenses: number | null;

  @ApiPropertyOptional({ example: '-3' })
  readonly earnings: number | null;

  constructor(expenses: number | null, earnings: number | null) {
    this.expenses = expenses;
    this.earnings = earnings;
  }
}
