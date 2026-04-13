import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Restrict route access to specific roles. Use with RolesGuard.
 *
 * @example
 * @Roles('ADMIN', 'MODERATOR')
 * @Get('admin/dashboard')
 * getDashboard() { ... }
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
