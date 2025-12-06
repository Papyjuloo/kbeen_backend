import env from '#start/env'

export default {
  baseUrl: env.get('QR_CODE_BASE_URL'),
  errorCorrectionLevel: 'H',
  type: 'image/png',
  quality: 0.92,
  margin: 1,
  width: 300,
}
