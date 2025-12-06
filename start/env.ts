import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  TZ: Env.schema.string(),
  PORT: Env.schema.number(),
  HOST: Env.schema.string(),
  LOG_LEVEL: Env.schema.string(),
  APP_KEY: Env.schema.string(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  
  DB_CONNECTION: Env.schema.string(),
  DB_HOST: Env.schema.string(),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),
  
  REDIS_HOST: Env.schema.string(),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),
  
  SESSION_DRIVER: Env.schema.string(),
  AUTH_SESSION_DRIVER: Env.schema.string(),
  
  STRIPE_SECRET_KEY: Env.schema.string(),
  STRIPE_PUBLISHABLE_KEY: Env.schema.string(),
  STRIPE_WEBHOOK_SECRET: Env.schema.string(),
  
  MQTT_BROKER_URL: Env.schema.string(),
  MQTT_USERNAME: Env.schema.string.optional(),
  MQTT_PASSWORD: Env.schema.string.optional(),
  MQTT_CLIENT_ID: Env.schema.string(),
  
  QR_CODE_BASE_URL: Env.schema.string(),
})
