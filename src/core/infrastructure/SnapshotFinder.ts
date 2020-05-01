import { Repository, Not, Equal } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { DateRange } from '@checkmoney/soap-opera';

import { TransactionSnapshot } from '../domain/TransactionSnapshot.entity';

@Injectable()
export class SnapshotFinder {
  constructor(
    @InjectRepository(TransactionSnapshot)
    private readonly repo: Repository<TransactionSnapshot>,
  ) {}

  async fetchWithDifferentCurrency(
    userId: string,
    currency: string,
  ): Promise<TransactionSnapshot[]> {
    const snapshots = await this.repo.find({
      userId,
      currency: Not(Equal(currency)),
    });

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

  async fetchByRange(
    userId: string,
    dateRange: DateRange,
  ): Promise<TransactionSnapshot[]> {
    const { start, end } = dateRange.toISOStrings();

    return this.repo
      .createQueryBuilder('s')
      .where('s.user_id = :userId', { userId })
      .where('s.date >= :start', { start })
      .andWhere('s.date < :end', { end })
      .getMany();
  }
}
