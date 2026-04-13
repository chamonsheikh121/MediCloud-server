import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

/**
 * Adds a timeout to all requests. Throws 408 Request Timeout if exceeded.
 * Default timeout is 30 seconds.
 *
 * @example
 * // Apply globally in main.ts
 * app.useGlobalInterceptors(new TimeoutInterceptor());
 *
 * // Or with custom timeout (in ms)
 * app.useGlobalInterceptors(new TimeoutInterceptor(10000));
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly timeoutMs: number = 30000) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      timeout(this.timeoutMs),
      catchError((err: unknown) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    );
  }
}
