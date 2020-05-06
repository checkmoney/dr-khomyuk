import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from '@checkmoney/soap-opera';

import { getUserFromContext } from './utils/getUserFromContext';

export const CurrentUser = createParamDecorator(
  async (_, context: ExecutionContext): Promise<TokenPayload> => {
    return getUserFromContext(context);
  },
);
