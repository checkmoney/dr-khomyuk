import { ExecutionContext } from '@nestjs/common';

export const getTokenFromContext = (context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();

  const token: string = request.headers.authorization.replace('Bearer ', '');

  return token;
};
