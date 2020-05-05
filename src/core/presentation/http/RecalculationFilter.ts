import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { RecalculationInProgressException } from './RecalculationInProgressException';

@Catch(RecalculationInProgressException)
export class RecalculationFilter implements ExceptionFilter {
  catch(exception: RecalculationInProgressException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<FastifyReply<void>>();

    response.status(204);
  }
}
