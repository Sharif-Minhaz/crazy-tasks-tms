import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      // =============== no token found, user is not admin, deny access ================
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    try {
      // =============== verify the token to check if user is already authenticated ================
      const payload: JwtPayload = this.jwtService.verify(token);
      if (payload.role !== 'admin') {
        throw new ForbiddenException(
          'You are not authorized to access this resource',
        );
      }

      return true;
    } catch (error) {
      console.error(error);

      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
