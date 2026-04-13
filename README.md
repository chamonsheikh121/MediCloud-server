# MediCloud API - Multi-Tenant Clinical Management Platform

A production-ready **NestJS + Prisma ORM** backend for MediCloud - a comprehensive clinical management system with multi-tenancy support.

## Tech Stack

- **NestJS** v11 - Progressive Node.js framework
- **Prisma ORM** v7 - Type-safe database client with PostgreSQL adapter
- **Swagger** - Auto-generated API documentation
- **Docker Compose** - PostgreSQL container setup
- **JWT** - Authentication & Authorization
- **ESLint + Prettier** - Code linting and formatting
- **Jest** - Unit and e2e testing

## Features

- ✅ **Multi-Tenancy**: Clinic-based data isolation
- ✅ **Patient Management**: Complete patient profiles with medical history
- ✅ **Doctor Management**: Doctor profiles, specializations, and availability
- ✅ **Appointment Scheduling**: Book, reschedule, and cancel appointments
- ✅ **Billing & Invoices**: Generate and track patient invoices
- ✅ **Pharmacy**: Medicine inventory management
- ✅ **Prescriptions**: Issue and track prescriptions with medicine details
- ✅ **Telemedicine**: Virtual consultation scheduling and management
- ✅ **Analytics**: Dashboard with clinic statistics and revenue tracking
- ✅ **Role-Based Access Control**: Admin, Doctor, Nurse, Receptionist roles
- ✅ **Error Handling**: Consistent error response format
- ✅ **Rate Limiting**: Protect API from abuse
- ✅ **Request/Response Logging**: Track all API activity

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Setup environment variables

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/medicloud_db"
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRATION="3600"
API_PORT=3000
NODE_ENV=development
```

### 3. Start PostgreSQL (Docker)

```bash
docker compose up -d
```

### 4. Run migrations and generate Prisma client

```bash
pnpm run migrate
```

### 5. Start the server

```bash
pnpm run dev
```

API will be available at `http://localhost:3000/v1`

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

## Folder Structure

```
src/
├── common/                      # Shared utilities and middlewares
│   ├── decorators/              # Custom decorators
│   │   ├── current-user.decorator.ts   # @CurrentUser() - extract user from request
│   │   ├── public.decorator.ts         # @Public() - bypass auth guards
│   │   ├── roles.decorator.ts          # @Roles() - restrict by role
│   │   └── index.ts
│   ├── exceptions/              # Custom exception classes
│   │   ├── app.exception.ts            # AppException with status code
│   │   └── index.ts
│   ├── filters/                 # Exception filters
│   │   ├── http-exception.filter.ts    # Consistent error response format
│   │   └── index.ts
│   ├── guards/                  # Auth and role guards
│   │   ├── roles.guard.ts              # Role-based access control (RBAC)
│   │   └── index.ts
│   ├── interceptors/            # Request/response interceptors
│   │   ├── logging.interceptor.ts      # Log request method, path, duration
│   │   ├── timeout.interceptor.ts      # 408 on request timeout (default 30s)
│   │   ├── transform.interceptor.ts    # Wrap response in { statusCode, message, data }
│   │   └── index.ts
│   ├── prisma/                  # Prisma module and service (global)
│   │   ├── prisma.module.ts            # Provides PrismaService globally
│   │   └── prisma.service.ts           # Prisma Client wrapper
│   └── types/
│       └── express.d.ts                # Express Request type extension
│
├── modules/
│   ├── auth/                    # Authentication & Token Management
│   │   ├── dto/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── * (existing)
│   │
│   ├── user/                    # User Management
│   │   ├── dto/
│   │   ├── user.controller.ts
│   │   ├── user.module.ts
│   │   ├── user.service.ts
│   │   └── * (existing)
│   │
│   ├── patient/                 # Patient Management
│   │   ├── dto/
│   │   │   ├── create-patient.dto.ts
│   │   │   └── update-patient.dto.ts
│   │   ├── patient.controller.ts
│   │   ├── patient.module.ts
│   │   └── patient.service.ts
│   │
│   ├── doctor/                  # Doctor Management
│   │   ├── dto/
│   │   │   ├── create-doctor.dto.ts
│   │   │   └── update-doctor.dto.ts
│   │   ├── doctor.controller.ts
│   │   ├── doctor.module.ts
│   │   └── doctor.service.ts
│   │
│   ├── appointment/             # Appointment Scheduling
│   │   ├── dto/
│   │   │   ├── create-appointment.dto.ts
│   │   │   ├── update-appointment.dto.ts
│   │   │   └── cancel-appointment.dto.ts
│   │   ├── appointment.controller.ts
│   │   ├── appointment.module.ts
│   │   └── appointment.service.ts
│   │
│   ├── invoice/                 # Billing & Invoicing
│   │   ├── dto/
│   │   │   ├── create-invoice.dto.ts
│   │   │   └── mark-paid.dto.ts
│   │   ├── invoice.controller.ts
│   │   ├── invoice.module.ts
│   │   └── invoice.service.ts
│   │
│   ├── pharmacy/                # Pharmacy & Medicine Inventory
│   │   ├── dto/
│   │   │   ├── create-medicine.dto.ts
│   │   │   └── update-stock.dto.ts
│   │   ├── pharmacy.controller.ts
│   │   ├── pharmacy.module.ts
│   │   └── pharmacy.service.ts
│   │
│   ├── prescription/            # Prescriptions Management
│   │   ├── dto/
│   │   │   └── create-prescription.dto.ts
│   │   ├── prescription.controller.ts
│   │   ├── prescription.module.ts
│   │   └── prescription.service.ts
│   │
│   ├── telemedicine/            # Virtual Consultations
│   │   ├── dto/
│   │   │   └── create-consultation.dto.ts
│   │   ├── telemedicine.controller.ts
│   │   ├── telemedicine.module.ts
│   │   └── telemedicine.service.ts
│   │
│   └── analytics/               # Dashboard & Statistics
│       ├── analytics.controller.ts
│       ├── analytics.module.ts
│       └── analytics.service.ts
│
├── app.controller.ts            # Health check endpoint
├── app.module.ts                # Root application module
├── app.service.ts
└── main.ts                      # Application entry point

prisma/
├── schema/
│   └── schema.prisma            # Complete database schema
│       ├── Clinic               # Multi-tenant root entity
│       ├── User                 # Authentication & Authorization
│       ├── Patient              # Patient profiles
│       ├── Doctor               # Doctor profiles
│       ├── Appointment          # Appointment scheduling
│       ├── Invoice              # Billing & invoices
│       ├── Medicine             # Pharmacy inventory
│       ├── Prescription         # Prescriptions
│       ├── PrescriptionItem     # Prescription medicine items
│       └── TelemedicineConsultation # Virtual consultations
│
├── generated/
│   └── prisma/                  # Auto-generated Prisma Client
│       ├── client.ts
│       ├── models.ts
│       └── enums.ts
│
└── migrations/                  # Database migrations
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh JWT token

### Patient Management
- `GET /patients` - Get all patients
- `GET /patients/:patientId` - Get patient by ID
- `POST /patients` - Create patient
- `PUT /patients/:patientId` - Update patient
- `DELETE /patients/:patientId` - Delete patient

### Doctor Management
- `GET /doctors` - Get all doctors
- `GET /doctors/:doctorId` - Get doctor by ID
- `POST /doctors` - Create doctor
- `PUT /doctors/:doctorId` - Update doctor
- `DELETE /doctors/:doctorId` - Delete doctor

### Appointments
- `GET /appointments` - Get appointments with filters
- `GET /appointments/:appointmentId` - Get appointment by ID
- `POST /appointments` - Create appointment
- `PUT /appointments/:appointmentId` - Update appointment
- `POST /appointments/:appointmentId/cancel` - Cancel appointment

### Invoicing
- `GET /invoices` - Get invoices
- `GET /invoices/:invoiceId` - Get invoice by ID
- `POST /invoices` - Create invoice
- `POST /invoices/:invoiceId/mark-paid` - Mark invoice as paid

### Pharmacy
- `GET /pharmacy/medicines` - Get all medicines
- `GET /pharmacy/medicines/:medicineId` - Get medicine by ID
- `POST /pharmacy/medicines` - Create medicine
- `PUT /pharmacy/medicines/:medicineId/stock` - Update stock

### Prescriptions
- `POST /prescriptions` - Create prescription
- `GET /prescriptions/:prescriptionId` - Get prescription
- `GET /prescriptions/patient/:patientId` - Get patient prescriptions

### Telemedicine
- `GET /telemedicine/consultations` - Get consultations
- `POST /telemedicine/consultations` - Create consultation
- `POST /telemedicine/consultations/:consultationId/start` - Start consultation

### Analytics
- `GET /analytics/dashboard` - Get dashboard analytics
- `GET /clinic/info` - Get clinic information
- `GET /clinic/statistics` - Get clinic statistics

## Database Models

### Clinic (Multi-Tenant Root)
```typescript
id, name, owner, email, plan, status, monthlyRevenue, storageUsed, createdAt, updatedAt
```

### User (Authentication)
```typescript
id, clinicId, email, password, name, role, permissions[], status, createdAt, updatedAt
```

### Patient
```typescript
id, clinicId, userId?, name, age, gender, condition, lastVisit, status, phone, email, 
blood, address, medicalHistory?, allergies[], emergencyContact, createdAt, updatedAt
```

### Doctor
```typescript
id, clinicId, userId, name, specialization, rating, availability, patients (count), 
experience, schedule, qualifications[], licenseNumber, phone, email, consultationFee
```

### Appointment
```typescript
id, clinicId, patientId, doctorId, date, time, status, type, notes?, duration, createdAt, updatedAt
```

### Invoice
```typescript
id, clinicId, patientId, appointmentId?, amount, status, date, dueDate, paidDate?, 
services[], notes?, paymentMethod?, transactionId?, createdAt, updatedAt
```

### Medicine
```typescript
id, clinicId, name, category, stock, expiry, price, supplier, reorderLevel, createdAt, updatedAt
```

### Prescription
```typescript
id, clinicId, patientId, doctorId, appointmentId?, notes?, createdAt, updatedAt
```

### PrescriptionItem
```typescript
id, prescriptionId, medicineId, dosage, frequency, duration, createdAt
```

### TelemedicineConsultation
```typescript
id, clinicId, patientId, doctorId, date, time, status, duration, meetingUrl?, sessionToken?, createdAt, updatedAt
```

## Common Utilities

### Decorators

```typescript
import { Public, CurrentUser, Roles } from 'src/common/decorators';

@Public()                          // Skip auth guard
@Get('health')
getHealth() { ... }

@Roles('admin', 'doctor')          // Restrict to roles
@Get('dashboard')
getDashboard() { ... }

@Get('profile')
getProfile(@CurrentUser() user) { ... }          // Full user object
getMyId(@CurrentUser('id') userId: string) { ... } // Single field
```

### Guards

```typescript
import { RolesGuard } from 'src/common/guards';

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
} from 'src/common/interceptors';

// Apply globally in main.ts
app.useGlobalInterceptors(
  new LoggingInterceptor(),        // GET /users - 12ms
  new TransformInterceptor(),      // { statusCode: 200, message: 'success', data: ... }
  new TimeoutInterceptor(15000),   // 408 after 15s (default 30s)
);
```

## Error Handling

All API errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "PATIENT_NOT_FOUND",
    "message": "The requested patient could not be found",
    "statusCode": 404,
    "timestamp": "2026-04-14T10:30:00Z"
  }
}
```

## Adding a New Module

```bash
nest g resource modules/your-module
```

This generates controller, service, module, DTOs, and spec files inside `src/modules/`.

## License

This project is open-source and free to use.

