import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Extract the current authenticated user from the request object.
 * Optionally pass a property key to extract a specific field.
 *
 * @example
 * @Get('profile')
 * getProfile(@CurrentUser() user: UserPayload) { return user; }
 *
 * @example
 * @Get('my-id')
 * getMyId(@CurrentUser('id') userId: string) { return userId; }
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request['user'];

    if (!user) return null;
    return data ? user[data] : user;
  },
);
