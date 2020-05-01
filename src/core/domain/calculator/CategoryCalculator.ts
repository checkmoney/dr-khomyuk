import { DateRange, PeriodType } from '@checkmoney/soap-opera';
import { Injectable } from '@nestjs/common';
import { chain } from 'lodash';

import { PeriodGrouper } from '../PeriodGrouper';
import { SnapshotFinder } from '../../infrastructure/SnapshotFinder';
import { NormalizedTransaction } from '../dto/NormalizedTransaction';
import { toAmount, summarize } from './helpers';

@Injectable()
export class CategoryCalculator {
  constructor(
    private readonly grouper: PeriodGrouper,
    private readonly finder: SnapshotFinder,
  ) {}

  async calculate(
    userId: string,
    dateRange: DateRange,
    periodType: PeriodType,
  ) {
    const transactions = await this.finder.fetchByRange(userId, dateRange);

    return this.grouper
      .groupHistoryByPeriods(transactions, periodType, dateRange)
      .map(({ period, earnings, expenses }) => ({
        period,
        earnings: this.transactionsToCategoryGroups(earnings),
        expenses: this.transactionsToCategoryGroups(expenses),
      }));
  }

  private transactionsToCategoryGroups(
    allTransactions: NormalizedTransaction[],
  ) {
    return chain(allTransactions)
      .groupBy((transaction) => transaction.category)
      .entries()
      .map(([category, transactions]) => ({
        category,
        amount: transactions.map(toAmount).reduce(summarize, 0n),
      }))
      .sortBy((group) => Number(group.amount))
      .reverse()
      .value();
  }
}
