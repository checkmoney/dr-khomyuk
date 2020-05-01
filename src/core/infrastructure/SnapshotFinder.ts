import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { TransactionSnapshot } from '../domain/TransactionSnapshot.entity';

@Injectable()
export class SnapshotFinder {
  constructor(
    @InjectRepository(TransactionSnapshot)
    private readonly repo: Repository<TransactionSnapshot>,
  ) {}

  async fetchIds(userId: string): Promise<string[]> {
    const ids = await this.repo
      .createQueryBuilder('s')
      .select('id')
      .where('user_id := userId', { userId })
      .getRawMany();

    // TODO: check what in ids and transform it to array of string

    return [];
  }
}
