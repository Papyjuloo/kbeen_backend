# API Documentation

## Base URL
```
http://localhost:3333/api
```

## Authentication
Most endpoints require authentication using Bearer token:
```
Authorization: Bearer <your-token>
```

## Response Format

### Success Response
```json
{
  "data": {},
  "message": "Success message"
}
```

### Error Response
```json
{
  "message": "Error message",
  "errors": []
}
```

## Endpoints

### Authentication

#### 1. Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890"
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### 2. Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 3. Get Current User
- **URL**: `/auth/me`
- **Method**: `GET`
- **Auth Required**: Yes

**Response** (200 OK):
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### Reservations

#### 1. List Reservations
- **URL**: `/reservations`
- **Method**: `GET`
- **Auth Required**: Yes

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (pending, confirmed, checked_in, completed, cancelled)

**Response** (200 OK):
```json
{
  "meta": {
    "total": 100,
    "per_page": 10,
    "current_page": 1,
    "last_page": 10
  },
  "data": [
    {
      "id": 1,
      "resourceId": 1,
      "startTime": "2024-01-15T10:00:00Z",
      "endTime": "2024-01-15T12:00:00Z",
      "numberOfPeople": 2,
      "status": "confirmed",
      "resource": {
        "id": 1,
        "name": "Conference Room A"
      }
    }
  ]
}
```

#### 2. Create Reservation
- **URL**: `/reservations`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:
```json
{
  "resourceId": 1,
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T12:00:00Z",
  "numberOfPeople": 2,
  "notes": "Birthday celebration"
}
```

**Response** (201 Created):
```json
{
  "reservation": {
    "id": 1,
    "resourceId": 1,
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T12:00:00Z",
    "numberOfPeople": 2,
    "status": "pending"
  }
}
```

#### 3. Get Available Time Slots
- **URL**: `/resources/:resourceId/available-slots`
- **Method**: `GET`
- **Auth Required**: Yes

**Query Parameters**:
- `date` (required): Date in ISO format (YYYY-MM-DD)
- `duration` (optional): Duration in minutes (default: 60)

**Response** (200 OK):
```json
{
  "slots": [
    {
      "startTime": "2024-01-15T09:00:00Z",
      "endTime": "2024-01-15T10:00:00Z"
    },
    {
      "startTime": "2024-01-15T10:30:00Z",
      "endTime": "2024-01-15T11:30:00Z"
    }
  ]
}
```

### Payments

#### 1. Create Payment Intent
- **URL**: `/payments/create-intent`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:
```json
{
  "reservationId": 1,
  "amount": 50.00,
  "currency": "usd"
}
```

**Response** (200 OK):
```json
{
  "paymentIntent": {
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentId": 1
  }
}
```

#### 2. Confirm Payment
- **URL**: `/payments/confirm`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:
```json
{
  "paymentIntentId": "pi_xxxxxxxxxxxxx"
}
```

**Response** (200 OK):
```json
{
  "payment": {
    "id": 1,
    "amount": 50.00,
    "status": "completed",
    "paidAt": "2024-01-15T10:00:00Z"
  }
}
```

### QR Codes

#### 1. Generate Reservation QR Code
- **URL**: `/qr-code/generate/reservation/:reservationId`
- **Method**: `POST`
- **Auth Required**: Yes

**Response** (200 OK):
```json
{
  "qrCode": {
    "data": "{\"type\":\"reservation\",\"reservationId\":1,...}",
    "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "token": "abc123..."
  }
}
```

#### 2. Scan for Check-In
- **URL**: `/qr-code/check-in`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:
```json
{
  "qrCodeData": "{\"type\":\"reservation\",\"reservationId\":1,...}"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Check-in successful",
  "reservation": {
    "id": 1,
    "status": "checked_in",
    "checkedInAt": "2024-01-15T10:00:00Z"
  }
}
```

### IoT Devices (Admin Only)

#### 1. List Devices
- **URL**: `/iot/devices`
- **Method**: `GET`
- **Auth Required**: Yes (Admin)

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status (online, offline, error)

**Response** (200 OK):
```json
{
  "meta": {
    "total": 50,
    "per_page": 10,
    "current_page": 1
  },
  "data": [
    {
      "id": 1,
      "name": "Main Door Lock",
      "type": "door_lock",
      "status": "online",
      "lastSeenAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### 2. Register Device
- **URL**: `/iot/devices`
- **Method**: `POST`
- **Auth Required**: Yes (Admin)

**Request Body**:
```json
{
  "name": "Main Door Lock",
  "type": "door_lock",
  "macAddress": "AA:BB:CC:DD:EE:FF",
  "location": "Main Entrance",
  "resourceId": 1
}
```

**Response** (201 Created):
```json
{
  "device": {
    "id": 1,
    "name": "Main Door Lock",
    "type": "door_lock",
    "mqttDeviceId": "device-1234567890-abc123",
    "status": "offline"
  }
}
```

#### 3. Send Command
- **URL**: `/iot/devices/:id/command`
- **Method**: `POST`
- **Auth Required**: Yes (Admin)

**Request Body**:
```json
{
  "command": "unlock",
  "payload": {
    "duration": 5
  }
}
```

**Response** (200 OK):
```json
{
  "result": {
    "success": true,
    "command": "unlock",
    "deviceId": 1
  }
}
```

## Status Codes

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Rate Limiting

API requests are limited to 100 requests per minute per IP address.

## Webhooks

### Stripe Webhook
- **URL**: `/payments/webhook`
- **Method**: `POST`
- **Auth Required**: No (verified via Stripe signature)

Handles payment events from Stripe:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`
