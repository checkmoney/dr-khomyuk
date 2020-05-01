import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { TransactionSnapshot } from '../domain/TransactionSnapshot.entity';

@Injectable()
export class SnapshotManager {
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
  ) {}

  async update(snapshots: TransactionSnapshot[]): Promise<void> {
    await this.em.save(snapshots);
  }

  async save(snapshots: TransactionSnapshot[]): Promise<void> {
    if (snapshots.length === 0) {
      return;
    }

    await this.em.insert(TransactionSnapshot, snapshots);
  }

  async delete(ids: string[]): Promise<void> {
    if (ids.length === 0) {
      return;
    }

    await this.em.delete(TransactionSnapshot, ids);
  }
}
