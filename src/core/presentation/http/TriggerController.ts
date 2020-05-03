import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { TokenPayload } from '@checkmoney/soap-opera';

import { AuthGuard } from './AuthGuard';
import { CurrentUser } from './CurrentUser';
import { TaskManager } from '&app/core/infrastructure/TaskManager';

@Controller('v1/trigger')
@UseGuards(AuthGuard)
@ApiTags('trigger')
@ApiBearerAuth()
export class TriggerController {
  constructor(private readonly tasks: TaskManager) {}

  @Post('/default-currency')
  @ApiCreatedResponse()
  async userChangedDefaultCurrency(@CurrentUser() user: TokenPayload) {
    await this.tasks.addCurrencyTask(user.login);
  }

  @Post('/transaction')
  @ApiCreatedResponse()
  async userCreatedOrDeletedTransaction(@CurrentUser() user: TokenPayload) {
    await this.tasks.addTransactionTask(user.login);
  }
}
