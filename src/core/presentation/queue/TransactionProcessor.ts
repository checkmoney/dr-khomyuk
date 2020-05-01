import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

import { TRANSACTION_QUEUE } from '&app/external/constants';
import { TransactionSynchronizer } from '&app/core/application/TransactionSynchronizer';

import { TaskPayload } from './TaskPayload';

@Processor(TRANSACTION_QUEUE)
export class TransactionProcessor {
  constructor(
    private readonly transactionSynchronizer: TransactionSynchronizer,
  ) {}

  @Process()
  async handleDefaultCurrencyChange(job: Job<TaskPayload>) {
    try {
      await this.transactionSynchronizer.synchronize(job.data.userId);
      await job.moveToCompleted();
    } catch (e) {
      await job.moveToFailed(e);
    }
  }
}
