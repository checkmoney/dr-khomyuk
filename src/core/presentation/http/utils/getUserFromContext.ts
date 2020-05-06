import { TokenPayload } from '@checkmoney/soap-opera';
import { ExecutionContext } from '@nestjs/common';

export const getUserFromContext = (context: ExecutionContext) => {
  const payload: TokenPayload = context.switchToHttp().getRequest().user;

  if (!payload) {
    throw new Error('Try to get current user in anonymous endpoint!');
  }

  return payload;
};
