import { MrButcher, MrSolomons, DetBell } from '@checkmoney/soap-opera';
import { difference, chunk } from 'lodash';

export class TransactionSynchronizer {
  constructor(
    private readonly history: MrButcher,
    private readonly converter: MrSolomons,
    private readonly users: DetBell,
  ) {}

  async synchronize(userId: string): Promise<void> {
    const token = await this.users.pretend(userId);

    const [savedIds, realIds, targetCurrency] = await Promise.all([
      this.getAllSavedIds(userId),
      this.getAllRealIds(token),
      Promise.resolve('RUB'), // TODO: fetch real target currency
    ]);

    const forDeleteIds = difference(savedIds, realIds);
    const forFetchIds = difference(realIds, savedIds);

    // TODO: delete to delete
    await this.fetchAndSaveTransactions(token, targetCurrency, forFetchIds);
  }

  private async fetchAndSaveTransactions(
    token: string,
    targetCurrency: string,
    allIds: string[],
  ): Promise<void> {
    for (const ids of chunk(allIds, 50)) {
      const newTransactions = await this.history.fetchTransactions(token, ids);

      const convertedTransactions = await Promise.all(
        newTransactions.map((transaction) =>
          this.converter.convertTransaction(transaction, targetCurrency),
        ),
      );

      // TODO: save transactions
    }
  }

  private async getAllSavedIds(userId: string): Promise<string[]> {
    return [];
  }

  private async getAllRealIds(token: string): Promise<string[]> {
    const allIds: string[] = [];

    for await (const id of this.history.lazyFetchIds(token)) {
      allIds.push(id);
    }

    return allIds;
  }
}
