import { Interval } from 'date-fns';
import { PeriodType } from '@checkmoney/soap-opera';

export interface DatePeriod extends Interval {
  type: PeriodType;
}
