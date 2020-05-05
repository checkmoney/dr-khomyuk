import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue, Job } from 'bull';

import { CURRENCY_QUEUE, TRANSACTION_QUEUE } from '&app/external/constants';

type Payload = {
  userId: string;
};

@Injectable()
export class TaskManager {
  constructor(
    @InjectQueue(CURRENCY_QUEUE)
    private readonly currencyQueue: Queue<Payload>,
    @InjectQueue(TRANSACTION_QUEUE)
    private readonly transactionQueue: Queue<Payload>,
  ) {}

  async addCurrencyTask(userId: string): Promise<void> {
    const alreadyScheduled = await this.queueHasWaitingUserJob(
      this.currencyQueue,
      userId,
    );

    if (alreadyScheduled) {
      return;
    }

    await this.currencyQueue.add({ userId });
  }

  async addTransactionTask(userId: string): Promise<void> {
    const alreadyScheduled = await this.queueHasWaitingUserJob(
      this.transactionQueue,
      userId,
    );

    if (alreadyScheduled) {
      return;
    }

    await this.transactionQueue.add({ userId });
  }

  async someTaskInProgress(userId: string): Promise<boolean> {
    const activeSyncs = await Promise.all([
      this.queueHasActiveUserJob(this.currencyQueue, userId),
      this.queueHasActiveUserJob(this.transactionQueue, userId),
    ]);

    return activeSyncs.some(Boolean);
  }

  private async queueHasWaitingUserJob(
    queue: Queue<Payload>,
    userId: string,
  ): Promise<boolean> {
    const jobs = await queue.getWaiting();

    return this.hasUserJob(jobs, userId);
  }

  private async queueHasActiveUserJob(
    queue: Queue<Payload>,
    userId: string,
  ): Promise<boolean> {
    const jobs = await queue.getActive();

    return this.hasUserJob(jobs, userId);
  }

  private hasUserJob(jobs: Job<Payload>[], userId: string) {
    return jobs.some(({ data }) => data.userId === userId);
  }
}
