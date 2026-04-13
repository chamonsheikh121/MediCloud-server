# NestJS + Prisma ORM Template

A production-ready **NestJS + Prisma ORM** starter template for team projects.
Click **"Use this template"** on GitHub to bootstrap a new project.

## Tech Stack

- **NestJS** v11 - Progressive Node.js framework
- **Prisma ORM** v7 - Type-safe database client with PostgreSQL adapter
- **Swagger** - Auto-generated API documentation
- **Docker Compose** - PostgreSQL container setup
- **ESLint + Prettier** - Code linting and formatting
- **Jest** - Unit and e2e testing

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Setup environment variables

```bash
cp .env.example .env
```

Edit `.env` with your database credentials.

### 3. Start PostgreSQL (Docker)

```bash
docker compose up -d
```

### 4. Run migrations and generate Prisma client

```bash
pnpm migrate
```

### 5. Start the server

```bash
pnpm dev
```

API docs available at `http://localhost:3000/api`

## Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `pnpm dev`             | Start in watch mode              |
| `pnpm build`           | Build for production             |
| `pnpm start:prod`      | Run production build             |
| `pnpm lint`            | Lint and auto-fix                |
| `pnpm format`          | Format code with Prettier        |
| `pnpm ci:fix`          | Run lint + format                |
| `pnpm migrate`         | Run Prisma migrations + generate |
| `pnpm migrate:prod`    | Deploy migrations (production)   |
| `pnpm prisma:studio`   | Open Prisma Studio               |
| `pnpm prisma:generate` | Generate Prisma client           |
| `pnpm test`            | Run unit tests                   |
| `pnpm test:e2e`        | Run e2e tests                    |
| `pnpm test:cov`        | Run tests with coverage          |


## Common Utilities

### Decorators

```typescript
import { Public, CurrentUser, Roles } from '../common/decorators';

@Public()                          // Skip auth guard
@Get('health')
getHealth() { ... }

@Roles('ADMIN', 'MODERATOR')      // Restrict to roles
@Get('dashboard')
getDashboard() { ... }

@Get('profile')
getProfile(@CurrentUser() user) { ... }          // Full user object
getMyId(@CurrentUser('id') userId: string) { ... } // Single field
```

### Guards

```typescript
import { RolesGuard } from '../common/guards';

// Apply globally in app.module.ts
providers: [{ provide: APP_GUARD, useClass: RolesGuard }]

// Then use @Roles() on any route
```

### Interceptors

```typescript
import {
  TransformInterceptor,
  LoggingInterceptor,
  TimeoutInterceptor,
} from '../common/interceptors';

// Apply globally in main.ts
app.useGlobalInterceptors(
  new LoggingInterceptor(),        // GET /users - 12ms
  new TransformInterceptor(),      // { statusCode: 200, message: 'success', data: ... }
  new TimeoutInterceptor(15000),   // 408 after 15s (default 30s)
);
```

## Adding a New Module

```bash
nest g resource modules/your-module
```

This generates controller, service, module, DTOs, and spec files inside `src/modules/`.

## License

This project is open-source and free to use.
# MediCloud-server
