import { MrButcher, MrSolomons, DetBell } from '@checkmoney/soap-opera';
import { Injectable } from '@nestjs/common';
import { difference, chunk } from 'lodash';

import { SnapshotFinder } from '../infrastructure/SnapshotFinder';
import { SnapshotManager } from '../infrastructure/SnapshotManager';
import { TransactionSnapshot } from '../domain/TransactionSnapshot.entity';

@Injectable()
export class TransactionSynchronizer {
  constructor(
    private readonly history: MrButcher,
    private readonly converter: MrSolomons,
    private readonly users: DetBell,
    private readonly snapshots: SnapshotFinder,
    private readonly manager: SnapshotManager,
  ) {}

  async synchronize(userId: string): Promise<void> {
    const token = await this.users.pretend(userId);

    const [realIds, savedIds, targetCurrency] = await Promise.all([
      this.history.eagerFetchIds(token),
      this.snapshots.fetchIds(userId),
      this.users.getDefaultCurrency(token),
    ]);

    const forDeleteIds = difference(savedIds, realIds);
    await this.manager.delete(forDeleteIds);

    const forFetchIds = difference(realIds, savedIds);
    await this.fetchAndSaveTransactions(
      userId,
      token,
      targetCurrency,
      forFetchIds,
    );
  }

  private async fetchAndSaveTransactions(
    userId: string,
    token: string,
    targetCurrency: string,
    allIds: string[],
  ): Promise<void> {
    const CHUNK_SIZE = 500;
    for (const ids of chunk(allIds, CHUNK_SIZE)) {
      const newTransactions = await this.history.fetchTransactions(token, ids);

      const convertedTransactions = await Promise.all(
        newTransactions.map((transaction) =>
          this.converter.convertTransaction(transaction, targetCurrency),
        ),
      );

      const snapshots = convertedTransactions.map(
        TransactionSnapshot.fromTransaction(userId),
      );

      await this.manager.save(snapshots);
    }
  }
}
