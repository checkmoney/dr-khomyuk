import { Repository, Not, Equal } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { DateRange } from '@checkmoney/soap-opera';
import { uniq } from 'lodash';

import { TransactionSnapshot } from '../domain/TransactionSnapshot.entity';
import { TaskManager } from './TaskManager';
import { InconsistentSnapshotsStateException } from '../utils/InconsistentSnapshotsStateException';

@Injectable()
export class SnapshotFinder {
  constructor(
    @InjectRepository(TransactionSnapshot)
    private readonly repo: Repository<TransactionSnapshot>,
    private readonly tasks: TaskManager,
  ) {}

  async fetchWithDifferentCurrency(
    userId: string,
    currency: string,
  ): Promise<TransactionSnapshot[]> {
    const snapshots = await this.repo
      .createQueryBuilder('s')
      .where('s.user_id = :userId', { userId })
      .andWhere('s.currency != :currency', { currency })
      .getMany();

    return snapshots;
  }

  async fetchIds(userId: string): Promise<string[]> {
    const rows = await this.repo
      .createQueryBuilder('s')
      .select('id')
      .where('s.user_id = :userId', { userId })
      .getRawMany();

    return rows.map((row) => row.id);
  }

  async findEarliestDate(userId: string): Promise<Date> {
    const snapshot = await this.repo
      .createQueryBuilder('s')
      .where('s.user_id = :userId', { userId })
      .orderBy('s.date')
      .getOne();

    if (!snapshot) {
      return new Date();
    }

    return snapshot.date;
  }

  async fetchConsistentByRange(
    userId: string,
    dateRange: DateRange,
  ): Promise<TransactionSnapshot[]> {
    const { start, end } = dateRange.toISOStrings();

    const snapshots = await this.repo
      .createQueryBuilder('s')
      .where('s.user_id = :userId', { userId })
      .andWhere('s.date >= :start', { start })
      .andWhere('s.date < :end', { end })
      .getMany();

    const currencies = uniq(snapshots.map((snapshot) => snapshot.currency));

    // snapshots are inconsistent
    if (currencies.length > 1) {
      // lets recalculate it
      await this.tasks.addCurrencyTask(userId);

      // and skip current calculation
      throw new InconsistentSnapshotsStateException();
    }

    return snapshots;
  }
}
