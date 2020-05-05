import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { InconsistentSnapshotsStateException } from '&app/core/utils/InconsistentSnapshotsStateException';

@Catch(InconsistentSnapshotsStateException)
export class RecalculationFilter implements ExceptionFilter {
  catch(exception: InconsistentSnapshotsStateException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<FastifyReply<void>>();

    response.status(204);
  }
}
