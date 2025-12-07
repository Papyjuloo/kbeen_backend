import env from '#start/env'
import { defineConfig } from '@adonisjs/session'

export default defineConfig({
  enabled: true,
  driver: env.get('SESSION_DRIVER'),
  cookieName: 'adonis-session',
  clearWithBrowser: false,
  age: '2h',
  cookie: {
    path: '/',
    httpOnly: true,
    secure: env.get('NODE_ENV') === 'production',
    sameSite: 'lax',
  },
})
