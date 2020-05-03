import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { CURRENCY_QUEUE, TRANSACTION_QUEUE } from '&app/external/constants';

@Injectable()
export class TaskManager {
  constructor(
    @InjectQueue(CURRENCY_QUEUE)
    private readonly currencyQueue: Queue,
    @InjectQueue(TRANSACTION_QUEUE)
    private readonly transactionQueue: Queue,
  ) {}

  async addCurrencyTask(userId: string): Promise<void> {
    await this.currencyQueue.add({ userId });
  }

  async addTransactionTask(userId: string): Promise<void> {
    await this.transactionQueue.add({ userId });
  }
}
