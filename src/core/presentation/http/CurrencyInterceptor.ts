import { FastifyReply } from 'fastify';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { mergeMap } from 'rxjs/operators';
import { DetBell } from '@checkmoney/soap-opera';

import { getTokenFromContext } from './utils/getTokenFromContext';

@Injectable()
export class CurrencyInterceptor implements NestInterceptor {
  constructor(private readonly users: DetBell) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const token = getTokenFromContext(context);

    const currencyPromise = this.users.getDefaultCurrency(token);

    return next.handle().pipe(
      mergeMap(async (data) => {
        const currency = await currencyPromise;

        context
          .switchToHttp()
          .getResponse<FastifyReply<any>>()
          .header('checkmoney-currency', currency);

        return data;
      }),
    );
  }
}
