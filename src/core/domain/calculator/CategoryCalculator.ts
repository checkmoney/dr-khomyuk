import { DateRange, PeriodType } from '@checkmoney/soap-opera';
import { Injectable } from '@nestjs/common';
import { chain, uniq } from 'lodash';

import { PeriodGrouper } from '../PeriodGrouper';
import { SnapshotFinder } from '../../infrastructure/SnapshotFinder';
import { NormalizedTransaction } from '../dto/NormalizedTransaction';
import { toAmount, summarize } from './helpers';
import { CategoryData, PeriodCategories } from '../dto/PeriodCategories';

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
    const transactions = await this.finder.fetchConsistentByRange(
      userId,
      dateRange,
    );

    return this.grouper
      .groupHistoryByPeriods(transactions, periodType, dateRange)
      .map(
        ({ period, earnings, expenses }) =>
          new PeriodCategories(
            this.transactionsToCategoryGroups(expenses),
            this.transactionsToCategoryGroups(earnings),
            period,
          ),
      );
  }

  private transactionsToCategoryGroups(
    allTransactions: NormalizedTransaction[],
  ) {
    return chain(allTransactions)
      .groupBy((transaction) => transaction.category)
      .entries()
      .map(([category, transactions]) => {
        const amount = transactions.map(toAmount).reduce(summarize, 0n);

        return new CategoryData(amount, category);
      })
      .sortBy((group) => Number(group.amount))
      .reverse()
      .value();
  }
}
