import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from '@checkmoney/soap-opera';

export const CurrentUser = createParamDecorator(
  async (_, context: ExecutionContext): Promise<TokenPayload> => {
    const payload: TokenPayload = context.switchToHttp().getRequest().user;

    if (!payload) {
      throw new Error('Try to get current user in anonymous endpoint!');
    }

    return payload;
  },
);
