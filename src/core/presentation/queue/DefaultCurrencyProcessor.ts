import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

import { CURRENCY_QUEUE } from '&app/external/constants';
import { CurrencySynchronizer } from '&app/core/application/CurrencySynchronizer';

import { TaskPayload } from './TaskPayload';

@Processor(CURRENCY_QUEUE)
export class DefaultCurrencyProcessor {
  constructor(private readonly currencySynchronizer: CurrencySynchronizer) {}

  @Process()
  async handleDefaultCurrencyChange(job: Job<TaskPayload>) {
    try {
      await this.currencySynchronizer.synchronize(job.data.userId);
      await job.moveToCompleted();
    } catch (error) {
      await job.moveToFailed(error);
    }
  }
}
