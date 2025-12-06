import Env from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  // Application
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),

  // Database
  DB_CONNECTION: Env.schema.string(),
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  // Redis
  REDIS_CONNECTION: Env.schema.string(),
  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),

  // Authentication
  SESSION_DRIVER: Env.schema.string(),
  HASH_DRIVER: Env.schema.string(),

  // Stripe
  STRIPE_SECRET_KEY: Env.schema.string(),
  STRIPE_PUBLISHABLE_KEY: Env.schema.string(),
  STRIPE_WEBHOOK_SECRET: Env.schema.string(),

  // MQTT
  MQTT_BROKER_URL: Env.schema.string(),
  MQTT_CLIENT_ID: Env.schema.string(),
  MQTT_USERNAME: Env.schema.string.optional(),
  MQTT_PASSWORD: Env.schema.string.optional(),
  MQTT_TOPIC_PREFIX: Env.schema.string(),

  // QR Code
  QR_CODE_BASE_URL: Env.schema.string(),
  QR_CODE_ERROR_CORRECTION: Env.schema.string(),

  // Logging
  LOG_LEVEL: Env.schema.string(),
})
