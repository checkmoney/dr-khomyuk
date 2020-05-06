import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { DetBell } from '@checkmoney/soap-opera';

import { getTokenFromContext } from './utils/getTokenFromContext';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly users: DetBell) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const token = getTokenFromContext(context);
      const payload = await this.users.decode(token);
      request.user = payload;

      return true;
    } catch (error) {
      return false;
    }
  }
}
