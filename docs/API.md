# API Documentation

## Base URL
```
http://localhost:3333/api/v1
```

## Authentication
Most endpoints require authentication via session cookies. Use the `/auth/login` endpoint to authenticate.

---

## Auth Endpoints

### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phoneNumber": "+33612345678"
}
```

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /api/v1/auth/me
Authorization: Required (session)
```

---

## Reservations Endpoints

### List Reservations
```http
GET /api/v1/reservations
Authorization: Required (session)
```

### Create Reservation
```http
POST /api/v1/reservations
Authorization: Required (session)
Content-Type: application/json

{
  "resourceType": "room",
  "resourceId": "room-101",
  "startDate": "2024-12-10T10:00:00Z",
  "endDate": "2024-12-10T12:00:00Z",
  "amount": 50.00,
  "notes": "Meeting room for team sync"
}
```

### Get Reservation
```http
GET /api/v1/reservations/:id
Authorization: Required (session)
```

### Cancel Reservation
```http
POST /api/v1/reservations/:id/cancel
Authorization: Required (session)
```

### Get QR Code
```http
GET /api/v1/reservations/:id/qr-code
Authorization: Required (session)
```

---

## Payments Endpoints

### Create Payment Intent
```http
POST /api/v1/payments/create-intent
Content-Type: application/json

{
  "reservationId": 1,
  "amount": 50.00,
  "currency": "eur"
}
```

### Confirm Payment
```http
POST /api/v1/payments/confirm
Content-Type: application/json

{
  "paymentIntentId": "pi_xxx",
  "reservationId": 1
}
```

### Get Payment
```http
GET /api/v1/payments/:id
```

### Refund Payment
```http
POST /api/v1/payments/refund/:id
Authorization: Required (session)
```

---

## QR Code Endpoints

### Generate QR Code
```http
GET /api/v1/qr-codes/generate?data=your-data-here
```

### Validate QR Code
```http
POST /api/v1/qr-codes/validate
Content-Type: application/json

{
  "code": "abc123def456"
}
```

### Scan QR Code
```http
POST /api/v1/qr-codes/:code/scan
```

---

## IoT Endpoints

### List Devices
```http
GET /api/v1/iot/devices
Authorization: Required (session)
```

### Register Device
```http
POST /api/v1/iot/devices
Authorization: Required (session)
Content-Type: application/json

{
  "deviceId": "device-001",
  "name": "Door Lock 1",
  "type": "lock",
  "location": "Main Entrance",
  "metadata": {
    "manufacturer": "Smart Lock Inc"
  }
}
```

### Send Command to Device
```http
POST /api/v1/iot/devices/:id/command
Authorization: Required (session)
Content-Type: application/json

{
  "command": "unlock",
  "payload": {
    "duration": 30
  }
}
```

### Get Device Status
```http
GET /api/v1/iot/devices/:id/status
Authorization: Required (session)
```

---

## Error Responses

### Validation Error (422)
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "The email field must be a valid email",
      "rule": "email"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "message": "Unauthorized access"
}
```

### Not Found (404)
```json
{
  "message": "Resource not found"
}
```

### Server Error (500)
```json
{
  "message": "Internal server error"
}
```
