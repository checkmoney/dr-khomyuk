import { PeriodType, DateRange as BaseDateRange } from '@checkmoney/soap-opera';
import { ApiProperty } from '@nestjs/swagger';

export class DatePeriod extends BaseDateRange {
  @ApiProperty({ enum: Object.values(PeriodType), example: PeriodType.Year })
  readonly type: PeriodType;

  @ApiProperty({ example: new Date() })
  readonly start: Date;

  @ApiProperty({ example: new Date() })
  readonly end: Date;

  constructor(type: PeriodType, start: Date, end: Date) {
    super(start, end);

    this.type = type;
    this.start = start;
    this.end = end;
  }
}
