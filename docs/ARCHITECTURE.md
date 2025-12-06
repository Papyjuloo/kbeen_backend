# Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      KBeen Backend API                       │
│                    (AdonisJS + TypeScript)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   HTTP API   │    │     MQTT     │    │   Webhooks   │
│  (REST API)  │    │  (IoT Comm)  │    │   (Stripe)   │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            ┌───────────┐       ┌───────────┐
            │   Routes  │       │Middleware │
            └───────────┘       └───────────┘
                    │                   │
                    └─────────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    │   Controllers     │
                    └─────────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    │    Services       │
                    └─────────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    │     Models        │
                    └─────────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    │    Database       │
                    │   (PostgreSQL)    │
                    └───────────────────┘
```

## Module Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      Module Organization                      │
└──────────────────────────────────────────────────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Auth Module   │  │Reservation Mod. │  │  Payment Module │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ • Register      │  │ • Create        │  │ • Create Intent │
│ • Login         │  │ • Read          │  │ • Confirm       │
│ • Logout        │  │ • Update        │  │ • Refund        │
│ • Profile       │  │ • Cancel        │  │ • Webhook       │
│ • Password      │  │ • Check-in      │  │ • Methods       │
└─────────────────┘  │ • Check-out     │  └─────────────────┘
                     │ • Availability  │
┌─────────────────┐  └─────────────────┘  ┌─────────────────┐
│  QR Code Module │                       │   IoT Module    │
├─────────────────┤  ┌─────────────────┐  ├─────────────────┤
│ • Generate      │  │  Resource Mod.  │  │ • Register      │
│ • Verify        │  ├─────────────────┤  │ • Control       │
│ • Scan          │  │ • Rooms         │  │ • Monitor       │
│ • Check-in      │  │ • Spaces        │  │ • Telemetry     │
│ • Access        │  │ • Equipment     │  │ • Commands      │
└─────────────────┘  └─────────────────┘  │ • Door Locks    │
                                           └─────────────────┘
```

## Data Flow

### 1. Reservation Flow
```
User Request → Auth Middleware → Controller → Service → Model → Database
                                                  ↓
                                         Check Availability
                                                  ↓
                                          Create Reservation
                                                  ↓
                                         Generate QR Code
                                                  ↓
                                    Return Reservation + QR Code
```

### 2. Payment Flow
```
User → Create Payment Intent → Stripe API
                                    ↓
                            Return Client Secret
                                    ↓
                          User Completes Payment
                                    ↓
                            Stripe Webhook
                                    ↓
                         Update Payment Status
                                    ↓
                      Confirm Reservation Status
```

### 3. IoT Device Flow
```
Device → MQTT Broker → Backend Service
                            ↓
                    Parse MQTT Message
                            ↓
                  ┌─────────┴─────────┐
                  │                   │
                  ▼                   ▼
          Update Status         Save Telemetry
                  │                   │
                  └─────────┬─────────┘
                            │
                      Log to Database
```

### 4. QR Code Access Flow
```
User Scans QR → Controller → Service
                                 ↓
                         Verify Token
                                 ↓
                      Check Reservation
                                 ↓
                    Validate Time Window
                                 ↓
                      Log Access Event
                                 ↓
                ┌────────────────┴────────────────┐
                │                                 │
                ▼                                 ▼
        Grant Access                      Send IoT Command
                │                                 │
                └────────────────┬────────────────┘
                                 │
                         Return Response
```

## Database Schema

```
┌────────────┐     ┌──────────────┐     ┌───────────────┐
│   Users    │────<│ Reservations │>────│   Resources   │
└────────────┘     └──────────────┘     └───────────────┘
      │                    │                      │
      │                    │                      │
      │            ┌───────┴───────┐             │
      │            │               │             │
      ▼            ▼               ▼             ▼
┌────────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────┐
│  Payments  │ │ QR Scans │ │  IoT Devices │ │   ...    │
└────────────┘ └──────────┘ └──────────────┘ └──────────┘
                                    │
                        ┌───────────┴───────────┐
                        │                       │
                        ▼                       ▼
                ┌───────────────┐     ┌───────────────┐
                │ IoT Telemetry │     │   IoT Logs    │
                └───────────────┘     └───────────────┘
```

## Technology Stack

### Backend Framework
- **AdonisJS 6.x** - Node.js MVC framework
- **TypeScript** - Type-safe development
- **Lucid ORM** - Database abstraction

### Database
- **PostgreSQL** - Primary database
- **Redis** - Session & caching (future)

### External Services
- **Stripe** - Payment processing
- **MQTT** - IoT device communication
- **QRCode** - QR code generation

### Key Libraries
- `luxon` - Date/time handling
- `mqtt` - MQTT client
- `qrcode` - QR code generation
- `stripe` - Payment processing
- `bcrypt` - Password hashing

## Security Layers

```
┌────────────────────────────────────────────┐
│            Input Validation                 │  ← Request validation
├────────────────────────────────────────────┤
│         Authentication Layer               │  ← JWT/Session
├────────────────────────────────────────────┤
│        Authorization Layer                 │  ← Role-based access
├────────────────────────────────────────────┤
│           CSRF Protection                  │  ← Token validation
├────────────────────────────────────────────┤
│          CORS Configuration                │  ← Origin control
├────────────────────────────────────────────┤
│        Rate Limiting (Future)              │  ← DDoS prevention
├────────────────────────────────────────────┤
│         Data Encryption                    │  ← Password hashing
└────────────────────────────────────────────┘
```

## API Endpoint Organization

```
/api
├── /auth
│   ├── POST   /register
│   ├── POST   /login
│   ├── POST   /logout
│   ├── GET    /me
│   ├── PUT    /profile
│   └── POST   /change-password
│
├── /reservations
│   ├── GET    /
│   ├── POST   /
│   ├── GET    /:id
│   ├── PUT    /:id
│   ├── POST   /:id/cancel
│   ├── POST   /:id/check-in
│   └── POST   /:id/check-out
│
├── /payments
│   ├── GET    /
│   ├── POST   /create-intent
│   ├── POST   /confirm
│   ├── POST   /:id/refund
│   ├── POST   /webhook
│   └── /payment-methods
│       ├── GET    /
│       ├── POST   /
│       └── DELETE /:id
│
├── /qr-code
│   ├── POST   /generate/reservation/:id
│   ├── GET    /generate/resource/:id
│   ├── POST   /verify
│   ├── POST   /check-in
│   ├── POST   /access
│   └── GET    /history/:reservationId
│
└── /iot (Admin only)
    └── /devices
        ├── GET    /
        ├── POST   /
        ├── GET    /:id
        ├── PUT    /:id
        ├── DELETE /:id
        ├── POST   /:id/command
        ├── GET    /:id/status
        ├── GET    /:id/telemetry
        ├── POST   /:id/lock
        └── GET    /:id/logs
```

## Deployment Architecture (Production)

```
                    ┌─────────────┐
                    │   Client    │
                    │ (Web/Mobile)│
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Load       │
                    │  Balancer   │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
   │ Server  │       │ Server  │       │ Server  │
   │Instance1│       │Instance2│       │Instance3│
   └────┬────┘       └────┬────┘       └────┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
   │PostgreSQL│       │  Redis  │       │  MQTT   │
   │ Primary  │       │  Cache  │       │ Broker  │
   └──────────┘       └─────────┘       └─────────┘
```
