import { PeriodType } from '@checkmoney/soap-opera';
import {
  endOfYear,
  subYears,
  subMonths,
  subWeeks,
  subDays,
  endOfDay,
  endOfWeek,
  endOfMonth,
} from 'date-fns';

export const endOfPreviousPeriod = (periodType: PeriodType): Date => {
  const now = new Date();

  switch (periodType) {
    case PeriodType.Year:
      return endOfYear(subYears(now, 1));
    case PeriodType.Month:
      return endOfMonth(subMonths(now, 1));
    case PeriodType.Week:
      return endOfWeek(subWeeks(now, 1));
    case PeriodType.Day:
      return endOfDay(subDays(now, 1));
    default:
      throw new Error('Impossible situation');
  }
};
