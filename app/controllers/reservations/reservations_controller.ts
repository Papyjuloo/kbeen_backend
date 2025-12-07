import type { HttpContext } from '@adonisjs/core/http'
import Reservation from '#models/reservation'
import { createReservationValidator, updateReservationValidator } from '#validators/reservation_validator'
import QrCodeService from '#services/qr_code_service'

export default class ReservationsController {
  /**
   * Get all reservations for authenticated user
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.user!
    const reservations = await Reservation.query()
      .where('userId', user.id)
      .preload('payment')
      .preload('qrCode')
      .orderBy('createdAt', 'desc')

    return response.ok({ data: reservations })
  }

  /**
   * Create a new reservation
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(createReservationValidator)

    const reservation = await Reservation.create({
      ...payload,
      userId: user.id,
      status: 'pending',
    })

    return response.created({
      message: 'Reservation created successfully',
      data: reservation,
    })
  }

  /**
   * Get a specific reservation
   */
  async show({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const reservation = await Reservation.query()
      .where('id', params.id)
      .where('userId', user.id)
      .preload('payment')
      .preload('qrCode')
      .firstOrFail()

    return response.ok({ data: reservation })
  }

  /**
   * Update a reservation
   */
  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const reservation = await Reservation.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    const payload = await request.validateUsing(updateReservationValidator)
    reservation.merge(payload)
    await reservation.save()

    return response.ok({
      message: 'Reservation updated successfully',
      data: reservation,
    })
  }

  /**
   * Delete a reservation
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const reservation = await Reservation.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    await reservation.delete()

    return response.ok({ message: 'Reservation deleted successfully' })
  }

  /**
   * Cancel a reservation
   */
  async cancel({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const reservation = await Reservation.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    reservation.status = 'cancelled'
    await reservation.save()

    return response.ok({
      message: 'Reservation cancelled successfully',
      data: reservation,
    })
  }

  /**
   * Confirm a reservation
   */
  async confirm({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const reservation = await Reservation.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    reservation.status = 'confirmed'
    await reservation.save()

    return response.ok({
      message: 'Reservation confirmed successfully',
      data: reservation,
    })
  }

  /**
   * Get QR code for reservation
   */
  async getQrCode({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const reservation = await Reservation.query()
      .where('id', params.id)
      .where('userId', user.id)
      .preload('qrCode')
      .firstOrFail()

    const qrCodeService = new QrCodeService()
    const qrCodeData = await qrCodeService.generateForReservation(reservation)

    return response.ok({ data: qrCodeData })
  }
}
