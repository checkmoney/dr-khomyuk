import { Controller, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { CURRENCY_QUEUE, TRANSACTION_QUEUE } from '&app/external/constants';

@Controller('v1/trigger')
export class TriggerController {
  constructor(
    @InjectQueue(CURRENCY_QUEUE)
    private readonly currencyQueue: Queue,
    @InjectQueue(TRANSACTION_QUEUE)
    private readonly transactionQueue: Queue,
  ) {}

  @Post('/default-currency')
  async userChangedDefaultCurrency() {
    await this.currencyQueue.add({ userId: 'igor@kamyshev.me' });
  }

  @Post('/transaction')
  async userCreatedOrDeletedTransaction() {
    await this.transactionQueue.add({ userId: 'igor@kamyshev.me' });
  }
}
