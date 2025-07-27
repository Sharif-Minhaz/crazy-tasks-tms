import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class GuestGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    console.log(token);
    if (!token) {
      // =============== no token found, user is guest, allow access ================
      return true;
    }

    try {
      // =============== verify the token to check if user is already authenticated ================
      this.jwtService.verify(token);

      // =============== user is already logged in, deny access ================
      throw new ForbiddenException('You are already logged in');
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      // =============== invalid token, treat as guest and allow access ================
      return true;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
