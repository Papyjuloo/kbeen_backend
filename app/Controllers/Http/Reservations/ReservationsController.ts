import type { HttpContext } from '@adonisjs/core/http'
import ReservationService from '#services/Reservations/ReservationService'

export default class ReservationsController {
  private reservationService: ReservationService

  constructor() {
    this.reservationService = new ReservationService()
  }

  /**
   * List all reservations for authenticated user
   */
  async index({ auth, request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const status = request.input('status')

      const reservations = await this.reservationService.getUserReservations(
        auth.user!.id,
        { page, limit, status }
      )
      return response.ok(reservations)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Create a new reservation
   */
  async store({ request, response, auth }: HttpContext) {
    try {
      const data = request.only([
        'resourceId',
        'startTime',
        'endTime',
        'numberOfPeople',
        'notes',
      ])
      const reservation = await this.reservationService.create(auth.user!.id, data)
      return response.created({ reservation })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Get a specific reservation
   */
  async show({ params, response, auth }: HttpContext) {
    try {
      const reservation = await this.reservationService.getById(params.id, auth.user!.id)
      return response.ok({ reservation })
    } catch (error) {
      return response.notFound({ message: error.message })
    }
  }

  /**
   * Update a reservation
   */
  async update({ params, request, response, auth }: HttpContext) {
    try {
      const data = request.only(['startTime', 'endTime', 'numberOfPeople', 'notes'])
      const reservation = await this.reservationService.update(params.id, auth.user!.id, data)
      return response.ok({ reservation })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Cancel a reservation
   */
  async cancel({ params, response, auth }: HttpContext) {
    try {
      await this.reservationService.cancel(params.id, auth.user!.id)
      return response.ok({ message: 'Reservation cancelled successfully' })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Check-in for a reservation
   */
  async checkIn({ params, response, auth }: HttpContext) {
    try {
      const reservation = await this.reservationService.checkIn(params.id, auth.user!.id)
      return response.ok({ reservation })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Check-out from a reservation
   */
  async checkOut({ params, response, auth }: HttpContext) {
    try {
      const reservation = await this.reservationService.checkOut(params.id, auth.user!.id)
      return response.ok({ reservation })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * Get available time slots for a resource
   */
  async availableSlots({ params, request, response }: HttpContext) {
    try {
      const date = request.input('date')
      const duration = request.input('duration', 60)

      const slots = await this.reservationService.getAvailableSlots(
        params.resourceId,
        date,
        duration
      )
      return response.ok({ slots })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}
