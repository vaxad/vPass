// jwt.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthStrategy} from './auth.strategy'; // Assuming you have an AuthService to handle authentication
import { APPLY_MIDDLEWARE_KEY } from 'src/utils/applyMiddleware.decorator';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthStrategy) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const shouldApplyMiddleware = Reflect.getMetadata(APPLY_MIDDLEWARE_KEY, req.route?.stack[0]?.parent?.prototype) ?? false;

    if (!shouldApplyMiddleware) {
      return next();
    }
    const token = req.headers.authorization?.split(' ')[1]; // Extract the JWT token from the Authorization header
    if (token) {
      try {
        const user = await this.authService.validateToken(token);
        req.user = user;
      } catch (error) {
        throw UnauthorizedException;
      }
    }
    next();
  }
}
