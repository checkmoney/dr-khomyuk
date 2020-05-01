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

  async save(snapshots: TransactionSnapshot[]): Promise<void> {
    await this.em.insert(TransactionSnapshot, snapshots);
  }

  async delete(ids: string[]): Promise<void> {
    await this.em.delete(TransactionSnapshot, ids);
  }
}
