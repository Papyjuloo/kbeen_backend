import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  commands: [
    () => import('@adonisjs/core/commands'),
    () => import('@adonisjs/lucid/commands'),
  ],
  providers: [
    () => import('@adonisjs/core/providers/app_provider'),
    () => import('@adonisjs/core/providers/hash_provider'),
    () => import('@adonisjs/core/providers/http_provider'),
    () => import('@adonisjs/core/providers/repl_provider'),
    () => import('@adonisjs/session/session_provider'),
    () => import('@adonisjs/auth/auth_provider'),
    () => import('@adonisjs/lucid/database_provider'),
    () => import('@adonisjs/cors/cors_provider'),
  ],
  preloads: [
    () => import('./start/routes.js'),
    () => import('./start/kernel.js'),
    () => import('./start/events.js'),
  ],
  metaFiles: [
    {
      pattern: 'resources/views/**/*.edge',
      reloadServer: false,
    },
  ],
  tests: {
    timeout: 60_000,
    forceExit: true,
  },
})
