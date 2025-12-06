# Folder Structure Documentation

## Overview
This document explains the purpose and organization of each folder and key files in the KBeen Backend project.

## Root Directory

```
kbeen_backend/
├── app/                    # Application code
├── config/                 # Configuration files
├── database/               # Database-related files
├── docs/                   # Documentation
├── start/                  # Application bootstrap files
├── tests/                  # Test files
├── .env.example            # Environment variables template
├── .gitignore             # Git ignore rules
├── package.json           # NPM dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## /app Directory

Main application code organized by concern:

### /app/Controllers/Http
HTTP request handlers organized by feature:

- **Auth/** - Authentication controllers
  - `AuthController.ts` - User registration, login, logout, password management

- **Reservations/** - Reservation management
  - `ReservationsController.ts` - CRUD operations for reservations, check-in/check-out

- **Payments/** - Payment processing
  - `PaymentsController.ts` - Payment intents, confirmations, refunds, webhooks

- **QrCode/** - QR code operations
  - `QrCodeController.ts` - QR code generation, scanning, verification

- **IoT/** - IoT device management
  - `IoTController.ts` - Device registration, commands, telemetry, logs

### /app/Models
Lucid ORM models representing database tables:

- `User.ts` - User accounts
- `Resource.ts` - Bookable resources (rooms, spaces, equipment)
- `Reservation.ts` - Reservation records
- `Payment.ts` - Payment transactions
- `QrCodeScan.ts` - QR code scan history
- `IoTDevice.ts` - IoT device registry
- `IoTTelemetry.ts` - Device sensor data
- `IoTLog.ts` - Device event logs

### /app/Services
Business logic layer, separated from controllers:

- **Auth/** - Authentication business logic
  - `AuthService.ts` - User registration, login, password operations

- **Reservations/** - Reservation business logic
  - `ReservationService.ts` - Availability checking, conflict resolution, status management

- **Payments/** - Payment processing logic
  - `PaymentService.ts` - Stripe integration, payment lifecycle, webhooks

- **QrCode/** - QR code operations
  - `QrCodeService.ts` - QR generation, verification, scanning logic

- **IoT/** - IoT device management
  - `IoTService.ts` - MQTT communication, device commands, telemetry processing

### /app/Middleware
Custom middleware for request processing:

- `AuthMiddleware.ts` - Authentication verification
- `AdminMiddleware.ts` - Admin role verification

### /app/Validators
Request validation schemas (to be implemented):

- Validate incoming request data
- Ensure data integrity
- Provide meaningful error messages

### /app/Exceptions
Custom exception handlers (to be implemented):

- Custom error classes
- Error formatting
- Error logging

## /config Directory

Configuration files for various services:

- `auth.ts` - Authentication configuration (guards, providers)
- `database.ts` - Database connections and settings
- `cors.ts` - CORS (Cross-Origin Resource Sharing) settings

## /database Directory

Database-related files:

### /database/migrations
Database schema migrations (executed in order):

1. `1_create_users_table.ts` - Users table
2. `2_create_resources_table.ts` - Resources table
3. `3_create_reservations_table.ts` - Reservations table
4. `4_create_payments_table.ts` - Payments table
5. `5_create_qr_code_scans_table.ts` - QR code scans table
6. `6_create_iot_devices_table.ts` - IoT devices table
7. `7_create_iot_telemetry_table.ts` - Device telemetry table
8. `8_create_iot_logs_table.ts` - Device logs table

### /database/seeders
Database seeders for populating test data (to be implemented)

### /database/factories
Model factories for testing (to be implemented)

## /start Directory

Application bootstrap and initialization:

- `routes.ts` - Application routes definition
- `env.ts` - Environment variable validation and schema

## /tests Directory

Test suites:

### /tests/functional
End-to-end functional tests (to be implemented):
- API endpoint testing
- Integration testing
- User flow testing

### /tests/unit
Unit tests (to be implemented):
- Service layer testing
- Model testing
- Utility function testing

## /docs Directory

Additional documentation:

- `API.md` - Detailed API endpoint documentation
- `STRUCTURE.md` - This file

## Key Files

### package.json
NPM configuration including:
- Dependencies (AdonisJS, Stripe, MQTT, QRCode, etc.)
- Dev dependencies (TypeScript, ESLint, Prettier)
- Scripts (dev, build, test, lint)

### tsconfig.json
TypeScript compiler configuration:
- Strict mode enabled
- Path aliases configured (#controllers, #models, #services, etc.)
- ES2022 target

### .env.example
Template for environment variables:
- Application settings
- Database configuration
- External service credentials (Stripe, MQTT)
- Feature flags

### .gitignore
Files and directories excluded from version control:
- node_modules/
- build/
- .env
- Log files
- IDE files

## Design Principles

### Separation of Concerns
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Models**: Represent data and database interactions
- **Middleware**: Process requests before reaching controllers

### Modularity
Each feature (Auth, Reservations, Payments, QR Code, IoT) is self-contained:
- Own controllers
- Own services
- Own models
- Can be developed and tested independently

### Scalability
- Service layer allows complex logic without bloating controllers
- Models use relationships for efficient data fetching
- Middleware can be applied globally or per route
- Configuration is centralized and environment-based

### Maintainability
- Clear folder structure
- Consistent naming conventions
- TypeScript for type safety
- Comprehensive documentation

## Path Aliases

Configured in `tsconfig.json` for cleaner imports:

```typescript
import User from '#models/User'
import AuthService from '#services/Auth/AuthService'
import AuthController from '#controllers/Http/Auth/AuthController'
```

Instead of:
```typescript
import User from '../../../app/Models/User'
```

## Next Steps for Development

1. Implement validators for all endpoints
2. Add custom exception handlers
3. Create database seeders for testing
4. Write comprehensive tests (unit and functional)
5. Add API documentation generator (Swagger/OpenAPI)
6. Implement rate limiting
7. Add logging service
8. Create admin dashboard
9. Add email/SMS notification services
10. Implement WebSocket for real-time updates
