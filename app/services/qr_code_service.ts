import QRCode from 'qrcode'
import { randomBytes } from 'node:crypto'
import QrCode from '#models/qr_code'
import Reservation from '#models/reservation'
import qrcodeConfig from '#config/qrcode'

export default class QrCodeService {
  /**
   * Generate a QR code image
   */
  async generate(data: string): Promise<string> {
    return QRCode.toDataURL(data, {
      errorCorrectionLevel: qrcodeConfig.errorCorrectionLevel,
      type: qrcodeConfig.type,
      quality: qrcodeConfig.quality,
      margin: qrcodeConfig.margin,
      width: qrcodeConfig.width,
    })
  }

  /**
   * Generate a unique code
   */
  generateUniqueCode(): string {
    return randomBytes(16).toString('hex')
  }

  /**
   * Generate QR code for a reservation
   */
  async generateForReservation(reservation: Reservation) {
    // Check if QR code already exists
    let qrCode = await QrCode.query()
      .where('reservationId', reservation.id)
      .first()

    if (!qrCode) {
      const code = this.generateUniqueCode()
      const expiresAt = reservation.endDate.plus({ hours: 2 })

      qrCode = await QrCode.create({
        reservationId: reservation.id,
        code,
        data: JSON.stringify({
          reservationId: reservation.id,
          code,
        }),
        isActive: true,
        expiresAt: expiresAt.toJSDate(),
      })
    }

    // Generate QR code image
    const qrCodeImage = await this.generate(
      `${qrcodeConfig.baseUrl}/${qrCode.code}`
    )

    return {
      code: qrCode.code,
      qrCodeImage,
      expiresAt: qrCode.expiresAt,
    }
  }

  /**
   * Validate a QR code
   */
  async validate(code: string): Promise<boolean> {
    const qrCode = await QrCode.query()
      .where('code', code)
      .where('isActive', true)
      .first()

    if (!qrCode) {
      return false
    }

    return qrCode.expiresAt > new Date()
  }
}
