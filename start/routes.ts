import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// Health check
router.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// API v1 routes
router.group(() => {
  // Auth routes
  router.group(() => {
    router.post('/register', '#controllers/auth/auth_controller.register')
    router.post('/login', '#controllers/auth/auth_controller.login')
    router.post('/logout', '#controllers/auth/auth_controller.logout').use(middleware.auth())
    router.get('/me', '#controllers/auth/auth_controller.me').use(middleware.auth())
    router.put('/profile', '#controllers/auth/auth_controller.updateProfile').use(middleware.auth())
    router.post('/forgot-password', '#controllers/auth/auth_controller.forgotPassword')
    router.post('/reset-password', '#controllers/auth/auth_controller.resetPassword')
  }).prefix('/auth')

  // Reservations routes
  router.group(() => {
    router.get('/', '#controllers/reservations/reservations_controller.index')
    router.post('/', '#controllers/reservations/reservations_controller.store')
    router.get('/:id', '#controllers/reservations/reservations_controller.show')
    router.put('/:id', '#controllers/reservations/reservations_controller.update')
    router.delete('/:id', '#controllers/reservations/reservations_controller.destroy')
    router.post('/:id/cancel', '#controllers/reservations/reservations_controller.cancel')
    router.post('/:id/confirm', '#controllers/reservations/reservations_controller.confirm')
    router.get('/:id/qr-code', '#controllers/reservations/reservations_controller.getQrCode')
  }).prefix('/reservations').use(middleware.auth())

  // Payments routes
  router.group(() => {
    router.post('/create-intent', '#controllers/payments/payments_controller.createPaymentIntent')
    router.post('/confirm', '#controllers/payments/payments_controller.confirmPayment')
    router.get('/:id', '#controllers/payments/payments_controller.show')
    router.get('/reservation/:reservationId', '#controllers/payments/payments_controller.getByReservation')
    router.post('/webhook', '#controllers/payments/payments_controller.handleWebhook')
    router.post('/refund/:id', '#controllers/payments/payments_controller.refund')
  }).prefix('/payments')

  // QR Code routes
  router.group(() => {
    router.get('/generate', '#controllers/qr_codes/qr_codes_controller.generate')
    router.post('/validate', '#controllers/qr_codes/qr_codes_controller.validate')
    router.get('/:code', '#controllers/qr_codes/qr_codes_controller.show')
    router.post('/:code/scan', '#controllers/qr_codes/qr_codes_controller.scan')
  }).prefix('/qr-codes')

  // IoT routes
  router.group(() => {
    router.get('/devices', '#controllers/iot/iot_controller.listDevices')
    router.post('/devices', '#controllers/iot/iot_controller.registerDevice')
    router.get('/devices/:id', '#controllers/iot/iot_controller.getDevice')
    router.put('/devices/:id', '#controllers/iot/iot_controller.updateDevice')
    router.delete('/devices/:id', '#controllers/iot/iot_controller.deleteDevice')
    router.post('/devices/:id/command', '#controllers/iot/iot_controller.sendCommand')
    router.get('/devices/:id/status', '#controllers/iot/iot_controller.getDeviceStatus')
    router.get('/devices/:id/logs', '#controllers/iot/iot_controller.getDeviceLogs')
  }).prefix('/iot').use(middleware.auth())

}).prefix('/api/v1')
