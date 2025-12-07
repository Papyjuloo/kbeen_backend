import emitter from '@adonisjs/core/services/emitter'

/**
 * Register event listeners
 */

// User events
emitter.on('user:registered', 'app/listeners/user_listener.onRegistered')
emitter.on('user:login', 'app/listeners/user_listener.onLogin')

// Reservation events
emitter.on('reservation:created', 'app/listeners/reservation_listener.onCreate')
emitter.on('reservation:confirmed', 'app/listeners/reservation_listener.onConfirm')
emitter.on('reservation:cancelled', 'app/listeners/reservation_listener.onCancel')

// Payment events
emitter.on('payment:succeeded', 'app/listeners/payment_listener.onSuccess')
emitter.on('payment:failed', 'app/listeners/payment_listener.onFailure')
emitter.on('payment:refunded', 'app/listeners/payment_listener.onRefund')

// IoT events
emitter.on('iot:device:connected', 'app/listeners/iot_listener.onDeviceConnected')
emitter.on('iot:device:disconnected', 'app/listeners/iot_listener.onDeviceDisconnected')
emitter.on('iot:device:error', 'app/listeners/iot_listener.onDeviceError')
