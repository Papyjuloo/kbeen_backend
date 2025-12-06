/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/Http/Auth/AuthController'
import ReservationsController from '#controllers/Http/Reservations/ReservationsController'
import PaymentsController from '#controllers/Http/Payments/PaymentsController'
import QrCodeController from '#controllers/Http/QrCode/QrCodeController'
import IoTController from '#controllers/Http/IoT/IoTController'

// Health check
router.get('/', async () => {
  return { message: 'KBeen Backend API', version: '1.0.0' }
})

router.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// Authentication Routes
router.group(() => {
  router.post('/register', [AuthController, 'register'])
  router.post('/login', [AuthController, 'login'])
  router.post('/forgot-password', [AuthController, 'forgotPassword'])
  router.post('/reset-password', [AuthController, 'resetPassword'])
}).prefix('/api/auth')

// Protected Authentication Routes
router.group(() => {
  router.get('/me', [AuthController, 'me'])
  router.put('/profile', [AuthController, 'updateProfile'])
  router.post('/change-password', [AuthController, 'changePassword'])
  router.post('/logout', [AuthController, 'logout'])
}).prefix('/api/auth').middleware('auth')

// Reservation Routes
router.group(() => {
  router.get('/reservations', [ReservationsController, 'index'])
  router.post('/reservations', [ReservationsController, 'store'])
  router.get('/reservations/:id', [ReservationsController, 'show'])
  router.put('/reservations/:id', [ReservationsController, 'update'])
  router.post('/reservations/:id/cancel', [ReservationsController, 'cancel'])
  router.post('/reservations/:id/check-in', [ReservationsController, 'checkIn'])
  router.post('/reservations/:id/check-out', [ReservationsController, 'checkOut'])
  router.get('/resources/:resourceId/available-slots', [ReservationsController, 'availableSlots'])
}).prefix('/api').middleware('auth')

// Payment Routes
router.group(() => {
  router.get('/payments', [PaymentsController, 'index'])
  router.get('/payments/:id', [PaymentsController, 'show'])
  router.post('/payments/create-intent', [PaymentsController, 'createPaymentIntent'])
  router.post('/payments/confirm', [PaymentsController, 'confirmPayment'])
  router.post('/payments/:id/refund', [PaymentsController, 'refund'])
  router.get('/payment-methods', [PaymentsController, 'getPaymentMethods'])
  router.post('/payment-methods', [PaymentsController, 'addPaymentMethod'])
  router.delete('/payment-methods/:paymentMethodId', [PaymentsController, 'removePaymentMethod'])
}).prefix('/api').middleware('auth')

// Stripe Webhook (no auth required)
router.post('/api/payments/webhook', [PaymentsController, 'webhook'])

// QR Code Routes
router.group(() => {
  router.post('/qr-code/generate/reservation/:reservationId', [QrCodeController, 'generateReservationQrCode'])
  router.get('/qr-code/history/:reservationId', [QrCodeController, 'getQrCodeHistory'])
  router.post('/qr-code/verify', [QrCodeController, 'verifyQrCode'])
  router.post('/qr-code/check-in', [QrCodeController, 'scanForCheckIn'])
  router.post('/qr-code/generate-image', [QrCodeController, 'getQrCodeImage'])
}).prefix('/api').middleware('auth')

// QR Code Routes (public for resource QR codes)
router.group(() => {
  router.get('/qr-code/generate/resource/:resourceId', [QrCodeController, 'generateResourceQrCode'])
  router.post('/qr-code/access', [QrCodeController, 'scanForAccess'])
}).prefix('/api')

// IoT Device Routes (Admin only)
router.group(() => {
  router.get('/iot/devices', [IoTController, 'index'])
  router.get('/iot/devices/:id', [IoTController, 'show'])
  router.post('/iot/devices', [IoTController, 'store'])
  router.put('/iot/devices/:id', [IoTController, 'update'])
  router.delete('/iot/devices/:id', [IoTController, 'destroy'])
  router.post('/iot/devices/:id/command', [IoTController, 'sendCommand'])
  router.get('/iot/devices/:id/status', [IoTController, 'getStatus'])
  router.get('/iot/devices/:id/telemetry', [IoTController, 'getTelemetry'])
  router.post('/iot/devices/:id/lock', [IoTController, 'controlLock'])
  router.get('/iot/devices/:id/logs', [IoTController, 'getLogs'])
  router.get('/iot/resources/:resourceId/devices', [IoTController, 'getDevicesByResource'])
  router.post('/iot/devices/:id/test-connectivity', [IoTController, 'testConnectivity'])
}).prefix('/api').middleware(['auth', 'admin'])
