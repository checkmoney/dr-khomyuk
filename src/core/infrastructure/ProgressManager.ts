import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { CURRENCY_QUEUE, TRANSACTION_QUEUE } from '&app/external/constants';

type Payload = {
  userId: string;
};

@Injectable()
export class ProgressManager {
  constructor(
    @InjectQueue(CURRENCY_QUEUE)
    private readonly currencyQueue: Queue,
    @InjectQueue(TRANSACTION_QUEUE)
    private readonly transactionsQueue: Queue,
  ) {}

  async inProgress(userId: string): Promise<boolean> {
    const activeSyncs = await Promise.all([
      this.queryHasUserJob(this.currencyQueue, userId),
      this.queryHasUserJob(this.transactionsQueue, userId),
    ]);

    return activeSyncs.some(Boolean);
  }

  async queryHasUserJob(
    queue: Queue<Payload>,
    userId: string,
  ): Promise<boolean> {
    const jobs = await queue.getActive();

    return jobs.some(({ data }) => data.userId === userId);
  }
}
