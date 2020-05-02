import { Controller, Post, UseGuards } from '@nestjs/common';
import { TokenPayload } from '@checkmoney/soap-opera';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { CURRENCY_QUEUE, TRANSACTION_QUEUE } from '&app/external/constants';

import { AuthGuard } from './AuthGuard';
import { CurrentUser } from './CurrentUser';

@Controller('v1/trigger')
@UseGuards(AuthGuard)
export class TriggerController {
  constructor(
    @InjectQueue(CURRENCY_QUEUE)
    private readonly currencyQueue: Queue,
    @InjectQueue(TRANSACTION_QUEUE)
    private readonly transactionQueue: Queue,
  ) {}

  @Post('/default-currency')
  async userChangedDefaultCurrency(@CurrentUser() user: TokenPayload) {
    await this.currencyQueue.add({ userId: user.login });
  }

  @Post('/transaction')
  async userCreatedOrDeletedTransaction(@CurrentUser() user: TokenPayload) {
    await this.transactionQueue.add({ userId: user.login });
  }
}
