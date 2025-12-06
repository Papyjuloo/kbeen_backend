# KBeen Backend

A comprehensive AdonisJS backend application featuring Authentication, Reservations, Payments (Stripe), QR Code generation/scanning, and IoT device management.

## 🏗️ Architecture Overview

This backend follows a clean, modular architecture optimized for scalability and maintainability:

```
kbeen_backend/
├── app/
│   ├── Controllers/Http/        # HTTP request handlers
│   │   ├── Auth/               # Authentication controllers
│   │   ├── Reservations/       # Reservation management controllers
│   │   ├── Payments/           # Payment processing controllers
│   │   ├── QrCode/             # QR code generation/scanning controllers
│   │   └── IoT/                # IoT device management controllers
│   ├── Models/                 # Database models (Lucid ORM)
│   ├── Services/               # Business logic layer
│   │   ├── Auth/               # Authentication services
│   │   ├── Reservations/       # Reservation business logic
│   │   ├── Payments/           # Payment processing logic
│   │   ├── QrCode/             # QR code services
│   │   └── IoT/                # IoT device services
│   ├── Middleware/             # Custom middleware
│   ├── Validators/             # Request validation
│   └── Exceptions/             # Custom exceptions
├── config/                     # Application configuration
│   ├── auth.ts                 # Authentication configuration
│   ├── database.ts             # Database configuration
│   └── cors.ts                 # CORS configuration
├── database/
│   ├── migrations/             # Database migrations
│   ├── seeders/                # Database seeders
│   └── factories/              # Model factories
├── start/
│   ├── routes.ts               # Application routes
│   └── env.ts                  # Environment validation
└── tests/
    ├── functional/             # Functional tests
    └── unit/                   # Unit tests
```

## 📦 Features

### 1. Authentication & Authorization
- User registration and login
- Password management (change, reset)
- Role-based access control (user, admin)
- Session management
- Profile management

### 2. Reservation System
- Create, read, update, cancel reservations
- Resource availability checking
- Time slot management
- Check-in/check-out functionality
- Reservation status tracking (pending, confirmed, checked_in, completed, cancelled)
- Conflict prevention

### 3. Payment Processing (Stripe)
- Secure payment intent creation
- Payment confirmation
- Payment history tracking
- Refund processing
- Webhook handling for payment events
- Payment method management

### 4. QR Code Management
- QR code generation for reservations
- QR code generation for resources
- Secure token-based verification
- Check-in via QR code scanning
- Access control via QR code
- Scan history tracking
- Expiration handling

### 5. IoT Device Management
- Device registration and management
- MQTT-based communication
- Real-time device status monitoring
- Telemetry data collection (temperature, humidity, battery, signal)
- Remote command execution
- Door lock control
- Device logs and events
- Connectivity testing

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.x
- PostgreSQL >= 13.x
- Redis >= 6.x
- MQTT Broker (e.g., Mosquitto)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Papyjuloo/kbeen_backend.git
cd kbeen_backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- Database credentials
- Redis connection
- Stripe API keys
- MQTT broker details
- Application settings

4. Generate application key:
```bash
node ace generate:key
```

5. Run database migrations:
```bash
node ace migration:run
```

6. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3333`

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "phone": "+1234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Reservation Endpoints

#### Create Reservation
```http
POST /api/reservations
Authorization: Bearer <token>
Content-Type: application/json

{
  "resourceId": 1,
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T12:00:00Z",
  "numberOfPeople": 2,
  "notes": "Birthday party"
}
```

#### Get User Reservations
```http
GET /api/reservations?page=1&limit=10&status=confirmed
Authorization: Bearer <token>
```

#### Check Available Slots
```http
GET /api/resources/1/available-slots?date=2024-01-15&duration=60
Authorization: Bearer <token>
```

### Payment Endpoints

#### Create Payment Intent
```http
POST /api/payments/create-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "reservationId": 1,
  "amount": 50.00,
  "currency": "usd"
}
```

#### Confirm Payment
```http
POST /api/payments/confirm
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentIntentId": "pi_xxxxxxxxxxxxx"
}
```

### QR Code Endpoints

#### Generate Reservation QR Code
```http
POST /api/qr-code/generate/reservation/1
Authorization: Bearer <token>
```

#### Scan for Check-In
```http
POST /api/qr-code/check-in
Authorization: Bearer <token>
Content-Type: application/json

{
  "qrCodeData": "{\"type\":\"reservation\",\"reservationId\":1,...}"
}
```

### IoT Device Endpoints (Admin Only)

#### List Devices
```http
GET /api/iot/devices?page=1&limit=10&status=online
Authorization: Bearer <admin-token>
```

#### Register Device
```http
POST /api/iot/devices
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Main Door Lock",
  "type": "door_lock",
  "macAddress": "AA:BB:CC:DD:EE:FF",
  "location": "Main Entrance",
  "resourceId": 1
}
```

#### Send Command
```http
POST /api/iot/devices/1/command
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "command": "unlock",
  "payload": {}
}
```

#### Get Device Telemetry
```http
GET /api/iot/devices/1/telemetry?startDate=2024-01-01&endDate=2024-01-31&page=1&limit=50
Authorization: Bearer <admin-token>
```

## 🗄️ Database Schema

### Tables
1. **users** - User accounts and authentication
2. **resources** - Bookable resources (rooms, spaces, equipment)
3. **reservations** - Reservation records
4. **payments** - Payment transactions
5. **qr_code_scans** - QR code scan history
6. **iot_devices** - IoT device registry
7. **iot_telemetry** - Device telemetry data
8. **iot_logs** - Device logs and events

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- CSRF protection
- CORS configuration
- Secure QR code token generation
- Payment webhook signature verification
- Input validation and sanitization

## 🧪 Testing

Run tests:
```bash
npm test
```

Run specific test suite:
```bash
npm test -- tests/functional/auth.spec.ts
```

## 📝 Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `APP_KEY` - Application encryption key
- `DB_*` - Database configuration
- `STRIPE_SECRET_KEY` - Stripe API key
- `MQTT_BROKER_URL` - MQTT broker connection
- `QR_CODE_BASE_URL` - Base URL for QR codes

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code

### Code Style
- TypeScript strict mode enabled
- ESLint for code linting
- Prettier for code formatting
- Conventional commits encouraged

## 📦 Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables

3. Run migrations:
```bash
node ace migration:run --force
```

4. Start the server:
```bash
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Support

For issues and questions, please open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app integration
- [ ] Advanced IoT device types
- [ ] Real-time notifications via WebSocket
- [ ] Automated reservation reminders

---

Built with ❤️ using AdonisJS