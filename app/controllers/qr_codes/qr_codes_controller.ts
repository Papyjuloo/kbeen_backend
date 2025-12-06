import type { HttpContext } from '@adonisjs/core/http'
import QrCode from '#models/qr_code'
import QrCodeService from '#services/qr_code_service'

export default class QrCodesController {
  /**
   * Generate a QR code
   */
  async generate({ request, response }: HttpContext) {
    const { data } = request.only(['data'])
    
    const qrCodeService = new QrCodeService()
    const qrCodeImage = await qrCodeService.generate(data)

    return response.ok({
      data: {
        qrCode: qrCodeImage,
      },
    })
  }

  /**
   * Validate a QR code
   */
  async validate({ request, response }: HttpContext) {
    const { code } = request.only(['code'])

    const qrCode = await QrCode.query()
      .where('code', code)
      .where('isActive', true)
      .firstOrFail()

    const isValid = qrCode.expiresAt > new Date()

    return response.ok({
      data: {
        isValid,
        qrCode: isValid ? qrCode : null,
      },
    })
  }

  /**
   * Get QR code details
   */
  async show({ params, response }: HttpContext) {
    const qrCode = await QrCode.query()
      .where('code', params.code)
      .preload('reservation')
      .firstOrFail()

    return response.ok({ data: qrCode })
  }

  /**
   * Scan a QR code
   */
  async scan({ params, response }: HttpContext) {
    const qrCode = await QrCode.query()
      .where('code', params.code)
      .where('isActive', true)
      .preload('reservation')
      .firstOrFail()

    if (qrCode.expiresAt < new Date()) {
      return response.badRequest({ message: 'QR code has expired' })
    }

    if (qrCode.scannedAt) {
      return response.badRequest({ message: 'QR code has already been scanned' })
    }

    qrCode.scannedAt = new Date()
    await qrCode.save()

    return response.ok({
      message: 'QR code scanned successfully',
      data: qrCode,
    })
  }
}
