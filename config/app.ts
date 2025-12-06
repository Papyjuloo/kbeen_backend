import env from '#start/env'

export default {
  host: env.get('HOST'),
  port: env.get('PORT'),
  appKey: env.get('APP_KEY'),
  logger: {
    enabled: true,
    name: 'kbeen-api',
    level: env.get('LOG_LEVEL', 'info'),
  },
  allowMethodSpoofing: false,
  http: {
    trustProxy: false,
    cookie: {},
  },
}
