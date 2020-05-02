import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { DetBell } from '@checkmoney/soap-opera';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly users: DetBell) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const token: string = request.headers.authorization.replace(
        'Bearer ',
        '',
      );
      const payload = await this.users.decode(token);
      request.user = payload;

      return true;
    } catch (error) {
      return false;
    }
  }
}
