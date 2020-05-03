import { Interval } from 'date-fns';
import { PeriodType } from '@checkmoney/soap-opera';
import { ApiProperty } from '@nestjs/swagger';

export class DatePeriod implements Interval {
  @ApiProperty({ enum: Object.values(PeriodType), example: PeriodType.Year })
  readonly type: PeriodType;

  @ApiProperty({ example: new Date() })
  readonly start: Date;

  @ApiProperty({ example: new Date() })
  readonly end: Date;

  constructor(type: PeriodType, start: Date, end: Date) {
    this.type = type;
    this.start = start;
    this.end = end;
  }
}
