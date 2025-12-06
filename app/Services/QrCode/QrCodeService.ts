import QRCode from 'qrcode'
import Reservation from '#models/Reservation'
import QrCodeScan from '#models/QrCodeScan'
import { DateTime } from 'luxon'
import crypto from 'crypto'
import env from '#start/env'

export default class QrCodeService {
  private baseUrl: string
  private errorCorrectionLevel: QRCode.QRCodeErrorCorrectionLevel

  constructor() {
    this.baseUrl = env.get('QR_CODE_BASE_URL')
    this.errorCorrectionLevel = env.get('QR_CODE_ERROR_CORRECTION') as QRCode.QRCodeErrorCorrectionLevel
  }

  /**
   * Generate QR code for a reservation
   */
  async generateReservationQrCode(reservationId: number, userId: number) {
    // Verify reservation belongs to user
    const reservation = await Reservation.query()
      .where('id', reservationId)
      .where('user_id', userId)
      .firstOrFail()

    if (reservation.status === 'cancelled') {
      throw new Error('Cannot generate QR code for cancelled reservation')
    }

    // Generate secure token
    const token = this.generateSecureToken(reservationId, userId)

    // Create QR code data
    const qrData = {
      type: 'reservation',
      reservationId,
      userId,
      token,
      expiresAt: DateTime.now().plus({ hours: 24 }).toISO(),
    }

    const qrCodeString = JSON.stringify(qrData)
    const qrCodeImage = await this.generateQrCodeImage(qrCodeString)

    return {
      data: qrCodeString,
      image: qrCodeImage,
      token,
    }
  }

  /**
   * Generate QR code for a resource
   */
  async generateResourceQrCode(resourceId: number) {
    const qrData = {
      type: 'resource',
      resourceId,
      generatedAt: DateTime.now().toISO(),
    }

    const qrCodeString = JSON.stringify(qrData)
    const qrCodeImage = await this.generateQrCodeImage(qrCodeString)

    return {
      data: qrCodeString,
      image: qrCodeImage,
    }
  }

  /**
   * Generate QR code image
   */
  async generateQrCodeImage(data: string, format: 'png' | 'svg' = 'png'): Promise<string> {
    const options: QRCode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: this.errorCorrectionLevel,
      type: format === 'svg' ? 'svg' : 'image/png',
      width: 300,
      margin: 2,
    }

    if (format === 'svg') {
      return await QRCode.toString(data, { ...options, type: 'svg' })
    } else {
      return await QRCode.toDataURL(data, options)
    }
  }

  /**
   * Verify QR code data
   */
  async verifyQrCode(qrCodeData: string) {
    try {
      const data = JSON.parse(qrCodeData)

      // Check if QR code has expired
      if (data.expiresAt) {
        const expiresAt = DateTime.fromISO(data.expiresAt)
        if (expiresAt < DateTime.now()) {
          throw new Error('QR code has expired')
        }
      }

      // Verify token if present
      if (data.token && data.reservationId && data.userId) {
        const expectedToken = this.generateSecureToken(data.reservationId, data.userId)
        if (data.token !== expectedToken) {
          throw new Error('Invalid QR code token')
        }
      }

      return data
    } catch (error) {
      throw new Error('Invalid QR code data')
    }
  }

  /**
   * Scan QR code for check-in
   */
  async scanForCheckIn(qrCodeData: string, userId: number) {
    const data = await this.verifyQrCode(qrCodeData)

    if (data.type !== 'reservation') {
      throw new Error('Invalid QR code type for check-in')
    }

    if (data.userId !== userId) {
      throw new Error('QR code does not belong to this user')
    }

    // Get reservation and update status
    const reservation = await Reservation.findOrFail(data.reservationId)

    if (reservation.status !== 'confirmed') {
      throw new Error('Reservation must be confirmed for check-in')
    }

    reservation.status = 'checked_in'
    reservation.checkedInAt = DateTime.now()
    await reservation.save()

    // Log scan
    await QrCodeScan.create({
      reservationId: data.reservationId,
      userId,
      scanType: 'check_in',
      scannedAt: DateTime.now(),
    })

    return {
      success: true,
      message: 'Check-in successful',
      reservation,
    }
  }

  /**
   * Scan QR code for access control
   */
  async scanForAccess(qrCodeData: string, deviceId: string) {
    const data = await this.verifyQrCode(qrCodeData)

    if (data.type === 'reservation') {
      // Check if reservation is active
      const reservation = await Reservation.findOrFail(data.reservationId)

      const now = DateTime.now()
      const startTime = DateTime.fromJSDate(reservation.startTime)
      const endTime = DateTime.fromJSDate(reservation.endTime)

      if (reservation.status !== 'checked_in' && reservation.status !== 'confirmed') {
        return {
          access: false,
          message: 'Reservation not active',
        }
      }

      if (now < startTime.minus({ minutes: 15 }) || now > endTime) {
        return {
          access: false,
          message: 'Outside reservation time window',
        }
      }

      // Log scan
      await QrCodeScan.create({
        reservationId: data.reservationId,
        userId: data.userId,
        scanType: 'access',
        deviceId,
        scannedAt: now,
      })

      return {
        access: true,
        message: 'Access granted',
        reservation,
      }
    } else if (data.type === 'resource') {
      // Resource QR codes can be used for general access
      // Implementation depends on business logic
      return {
        access: true,
        message: 'Resource access granted',
        resourceId: data.resourceId,
      }
    }

    return {
      access: false,
      message: 'Invalid QR code type',
    }
  }

  /**
   * Get QR code scan history for a reservation
   */
  async getQrCodeHistory(reservationId: number, userId: number) {
    // Verify reservation belongs to user
    await Reservation.query()
      .where('id', reservationId)
      .where('user_id', userId)
      .firstOrFail()

    const scans = await QrCodeScan.query()
      .where('reservation_id', reservationId)
      .orderBy('scanned_at', 'desc')

    return scans
  }

  /**
   * Generate secure token for QR code
   */
  private generateSecureToken(reservationId: number, userId: number): string {
    const secret = env.get('APP_KEY')
    const data = `${reservationId}-${userId}-${secret}`
    return crypto.createHash('sha256').update(data).digest('hex')
  }
}
