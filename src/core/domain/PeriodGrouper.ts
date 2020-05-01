import { DateRange, PeriodType } from '@checkmoney/soap-opera';
import {
  startOfMonth,
  addMonths,
  format,
  startOfWeek,
  addWeeks,
  startOfDay,
  addDays,
  isWithinInterval,
  Interval,
} from 'date-fns';
import { range } from 'lodash';
import { Injectable } from '@nestjs/common';

import { TransactionSnapshot } from './TransactionSnapshot.entity';
import { DatePeriod } from './dto/DatePeriod';
import { NormalizedTransaction } from './dto/NormalizedTransaction';

@Injectable()
export class PeriodGrouper {
  groupHistoryByPeriods(
    transactions: TransactionSnapshot[],
    periodType: PeriodType,
    dateRange: DateRange,
  ) {
    const { earnings, expenses } = TransactionSnapshot.normalize(transactions);

    return this.createPeriods(periodType)(dateRange).map((period) => ({
      period,
      earnings: earnings.filter(this.rangeFilterForTransactions(period)),
      expenses: expenses.filter(this.rangeFilterForTransactions(period)),
    }));
  }

  private rangeFilterForTransactions = (interval: Interval) => ({
    date,
  }: NormalizedTransaction) => isWithinInterval(date, interval);

  private createPeriods = (periodType: PeriodType) =>
    ({
      [PeriodType.Year]: this.createYearPeriods,
      [PeriodType.Month]: this.createMonthPeriods,
      [PeriodType.Week]: this.createWeekPeriods,
      [PeriodType.Day]: this.createDayPeriods,
    }[periodType]);

  private createYearPeriods = ({ start, end }: DateRange): DatePeriod[] => {
    const firstYear = start.getFullYear();
    const lastYear = end.getFullYear();

    const years = range(firstYear, lastYear + 1);

    return years.map((year) => ({
      start: new Date(`${year}-01-01`),
      end: new Date(`${year + 1}-01-01`),
      type: PeriodType.Year,
    }));
  };

  private createMonthPeriods = ({ start, end }: DateRange): DatePeriod[] => {
    const groups: DatePeriod[] = [];

    let now = startOfMonth(start);
    while (now < end) {
      const next = startOfMonth(addMonths(now, 1));
      groups.push({
        start: now,
        end: next,
        type: PeriodType.Month,
      });

      now = next;
    }

    return groups;
  };

  private createWeekPeriods = ({ start, end }: DateRange): DatePeriod[] => {
    const groups: DatePeriod[] = [];

    let now = startOfWeek(start);
    while (now < end) {
      const next = startOfWeek(addWeeks(now, 1));
      groups.push({
        start: now,
        end: next,
        type: PeriodType.Week,
      });

      now = next;
    }

    return groups;
  };

  private createDayPeriods = ({ start, end }: DateRange): DatePeriod[] => {
    const groups: DatePeriod[] = [];

    let now = startOfDay(start);
    while (now < end) {
      const next = addDays(now, 1);
      groups.push({
        start: now,
        end: next,
        type: PeriodType.Day,
      });

      now = next;
    }

    return groups;
  };
}
