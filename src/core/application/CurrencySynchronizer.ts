/* eslint-disable no-await-in-loop */

import { MrSolomons, DetBell } from '@checkmoney/soap-opera';
import { Injectable } from '@nestjs/common';
import { chunk } from 'lodash';

import { SnapshotFinder } from '../infrastructure/SnapshotFinder';
import { SnapshotManager } from '../infrastructure/SnapshotManager';
import { TransactionSnapshot } from '../domain/TransactionSnapshot.entity';

@Injectable()
export class CurrencySynchronizer {
  constructor(
    private readonly converter: MrSolomons,
    private readonly users: DetBell,
    private readonly snapshots: SnapshotFinder,
    private readonly manager: SnapshotManager,
  ) {}

  async synchronize(userId: string): Promise<void> {
    const token = await this.users.pretend(userId);
    const targetCurrency = await this.users.getDefaultCurrency(token);
    const snapshots = await this.snapshots.fetchWithDifferentCurrency(
      userId,
      targetCurrency,
    );

    await this.convertAndSaveSnapshots(snapshots, targetCurrency);
  }

  private async convertAndSaveSnapshots(
    allSnapshots: TransactionSnapshot[],
    targetCurrency: string,
  ): Promise<void> {
    const CHUNK_SIZE = 100;
    for (const snapshots of chunk(allSnapshots, CHUNK_SIZE)) {
      await Promise.all(
        snapshots.map((snapshot) =>
          this.convertSnapshot(snapshot, targetCurrency),
        ),
      );

      await this.manager.update(snapshots);
    }
  }

  private async convertSnapshot(
    snapshot: TransactionSnapshot,
    targetCurrency: string,
  ): Promise<void> {
    try {
      const newAmount = await this.converter.convert({
        amount: snapshot.amount,
        from: snapshot.currency,
        date: snapshot.date,
        to: targetCurrency,
      });

      snapshot.convertToOtherCurrency(newAmount, targetCurrency);
    } catch (error) {
      // Ну не получилось и не получилось
    }
  }
}
