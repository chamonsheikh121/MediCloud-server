import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

/**
 * Wraps all successful responses in a consistent format:
 * { statusCode, message, data }
 *
 * @example
 * // Apply globally in main.ts
 * app.useGlobalInterceptors(new TransformInterceptor());
 *
 * // Or per-controller
 * @UseInterceptors(TransformInterceptor)
 * @Controller('users')
 * export class UserController { ... }
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const statusCode = context
      .switchToHttp()
      .getResponse<{ statusCode: number }>().statusCode;

    return next.handle().pipe(
      map((data: T) => ({
        statusCode,
        message: 'success',
        data,
      })),
    );
  }
}
