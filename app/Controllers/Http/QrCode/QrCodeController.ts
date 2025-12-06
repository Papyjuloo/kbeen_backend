import type { HttpContext } from '@adonisjs/core/http'
import QrCodeService from '#services/QrCode/QrCodeService'

export default class QrCodeController {
  private qrCodeService: QrCodeService

  constructor() {
    this.qrCodeService = new QrCodeService()
  }

  /**
   * Generate QR code for a reservation
   */
  async generateReservationQrCode({ params, response, auth }: HttpContext) {
    try {
      const reservationId = params.reservationId
      const qrCode = await this.qrCodeService.generateReservationQrCode(
        reservationId,
        auth.user!.id
      )
      return response.ok({ qrCode })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Generate QR code for resource access
   */
  async generateResourceQrCode({ params, response }: HttpContext) {
    try {
      const resourceId = params.resourceId
      const qrCode = await this.qrCodeService.generateResourceQrCode(resourceId)
      return response.ok({ qrCode })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Verify and decode QR code
   */
  async verifyQrCode({ request, response }: HttpContext) {
    try {
      const { qrCodeData } = request.only(['qrCodeData'])
      const decoded = await this.qrCodeService.verifyQrCode(qrCodeData)
      return response.ok({ decoded })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Scan QR code for check-in
   */
  async scanForCheckIn({ request, response, auth }: HttpContext) {
    try {
      const { qrCodeData } = request.only(['qrCodeData'])
      const result = await this.qrCodeService.scanForCheckIn(qrCodeData, auth.user!.id)
      return response.ok(result)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Scan QR code for access control
   */
  async scanForAccess({ request, response }: HttpContext) {
    try {
      const { qrCodeData, deviceId } = request.only(['qrCodeData', 'deviceId'])
      const result = await this.qrCodeService.scanForAccess(qrCodeData, deviceId)
      return response.ok(result)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Get QR code image as base64
   */
  async getQrCodeImage({ request, response }: HttpContext) {
    try {
      const { data, format } = request.only(['data', 'format'])
      const image = await this.qrCodeService.generateQrCodeImage(data, format || 'png')
      return response.ok({ image })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Get QR code history for a reservation
   */
  async getQrCodeHistory({ params, response, auth }: HttpContext) {
    try {
      const reservationId = params.reservationId
      const history = await this.qrCodeService.getQrCodeHistory(reservationId, auth.user!.id)
      return response.ok({ history })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}
