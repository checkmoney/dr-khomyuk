import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';

import uid from 'uid';

import { Progress, ProgressType } from '../domain/Progress.entity';

@Injectable()
export class ProgressManager {
  constructor(
    @InjectRepository(Progress)
    private readonly repo: Repository<Progress>,
    @InjectEntityManager()
    private readonly em: EntityManager,
  ) {}

  async execute(
    userId: string,
    type: ProgressType,
    callback: () => Promise<void>,
  ): Promise<void> {
    await this.start(userId, type);

    try {
      await callback();
    } finally {
      await this.end(userId, type);
    }
  }

  async inProgress(userId: string): Promise<boolean> {
    const rows = await this.repo
      .createQueryBuilder('p')
      .where('p.user_id = :userId', { userId })
      .getCount();

    return rows > 0;
  }

  private async start(userId: string, type: ProgressType): Promise<void> {
    const progress = new Progress(uid(), userId, type);
    await this.em.insert(Progress, progress);
  }

  private async end(userId: string, type: ProgressType): Promise<void> {
    await this.em.delete(Progress, { userId, type });
  }
}
