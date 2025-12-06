import Reservation from '#models/Reservation'
import { DateTime } from 'luxon'

export default class ReservationService {
  /**
   * Get all reservations for a user
   */
  async getUserReservations(
    userId: number,
    options: { page: number; limit: number; status?: string }
  ) {
    const query = Reservation.query()
      .where('user_id', userId)
      .preload('resource')
      .orderBy('start_time', 'desc')

    if (options.status) {
      query.where('status', options.status)
    }

    return await query.paginate(options.page, options.limit)
  }

  /**
   * Create a new reservation
   */
  async create(userId: number, data: any) {
    // Check if time slot is available
    const isAvailable = await this.checkAvailability(
      data.resourceId,
      data.startTime,
      data.endTime
    )

    if (!isAvailable) {
      throw new Error('Time slot is not available')
    }

    const reservation = await Reservation.create({
      userId,
      resourceId: data.resourceId,
      startTime: data.startTime,
      endTime: data.endTime,
      numberOfPeople: data.numberOfPeople,
      notes: data.notes,
      status: 'pending',
    })

    await reservation.load('resource')
    return reservation
  }

  /**
   * Get a specific reservation
   */
  async getById(id: number, userId: number) {
    const reservation = await Reservation.query()
      .where('id', id)
      .where('user_id', userId)
      .preload('resource')
      .firstOrFail()

    return reservation
  }

  /**
   * Update a reservation
   */
  async update(id: number, userId: number, data: any) {
    const reservation = await this.getById(id, userId)

    if (reservation.status === 'cancelled' || reservation.status === 'completed') {
      throw new Error('Cannot update a cancelled or completed reservation')
    }

    // Check if new time slot is available
    if (data.startTime || data.endTime) {
      const isAvailable = await this.checkAvailability(
        reservation.resourceId,
        data.startTime || reservation.startTime,
        data.endTime || reservation.endTime,
        id
      )

      if (!isAvailable) {
        throw new Error('Time slot is not available')
      }
    }

    reservation.merge(data)
    await reservation.save()
    await reservation.load('resource')

    return reservation
  }

  /**
   * Cancel a reservation
   */
  async cancel(id: number, userId: number) {
    const reservation = await this.getById(id, userId)

    if (reservation.status === 'cancelled') {
      throw new Error('Reservation is already cancelled')
    }

    if (reservation.status === 'completed') {
      throw new Error('Cannot cancel a completed reservation')
    }

    reservation.status = 'cancelled'
    await reservation.save()
  }

  /**
   * Check-in for a reservation
   */
  async checkIn(id: number, userId: number) {
    const reservation = await this.getById(id, userId)

    if (reservation.status !== 'confirmed') {
      throw new Error('Only confirmed reservations can be checked in')
    }

    reservation.status = 'checked_in'
    reservation.checkedInAt = DateTime.now()
    await reservation.save()

    return reservation
  }

  /**
   * Check-out from a reservation
   */
  async checkOut(id: number, userId: number) {
    const reservation = await this.getById(id, userId)

    if (reservation.status !== 'checked_in') {
      throw new Error('Only checked-in reservations can be checked out')
    }

    reservation.status = 'completed'
    reservation.checkedOutAt = DateTime.now()
    await reservation.save()

    return reservation
  }

  /**
   * Check if time slot is available
   */
  private async checkAvailability(
    resourceId: number,
    startTime: string,
    endTime: string,
    excludeReservationId?: number
  ): Promise<boolean> {
    const query = Reservation.query()
      .where('resource_id', resourceId)
      .whereIn('status', ['pending', 'confirmed', 'checked_in'])
      .where((builder) => {
        builder
          .whereBetween('start_time', [startTime, endTime])
          .orWhereBetween('end_time', [startTime, endTime])
          .orWhere((subBuilder) => {
            subBuilder.where('start_time', '<=', startTime).where('end_time', '>=', endTime)
          })
      })

    if (excludeReservationId) {
      query.whereNot('id', excludeReservationId)
    }

    const conflictingReservations = await query.count('* as total')
    return conflictingReservations[0].$extras.total === 0
  }

  /**
   * Get available time slots for a resource
   */
  async getAvailableSlots(resourceId: number, date: string, duration: number) {
    // Get all reservations for the date
    const startOfDay = DateTime.fromISO(date).startOf('day')
    const endOfDay = DateTime.fromISO(date).endOf('day')

    const reservations = await Reservation.query()
      .where('resource_id', resourceId)
      .whereIn('status', ['pending', 'confirmed', 'checked_in'])
      .whereBetween('start_time', [startOfDay.toISO(), endOfDay.toISO()])
      .orderBy('start_time', 'asc')

    // Calculate available slots (example: 9 AM to 9 PM)
    const workingHoursStart = startOfDay.set({ hour: 9 })
    const workingHoursEnd = startOfDay.set({ hour: 21 })

    const slots = []
    let currentTime = workingHoursStart

    while (currentTime.plus({ minutes: duration }) <= workingHoursEnd) {
      const slotEnd = currentTime.plus({ minutes: duration })

      // Check if slot conflicts with any reservation
      const hasConflict = reservations.some((reservation) => {
        const resStart = DateTime.fromISO(reservation.startTime.toString())
        const resEnd = DateTime.fromISO(reservation.endTime.toString())
        return (
          (currentTime >= resStart && currentTime < resEnd) ||
          (slotEnd > resStart && slotEnd <= resEnd) ||
          (currentTime <= resStart && slotEnd >= resEnd)
        )
      })

      if (!hasConflict) {
        slots.push({
          startTime: currentTime.toISO(),
          endTime: slotEnd.toISO(),
        })
      }

      currentTime = currentTime.plus({ minutes: 30 }) // 30-minute intervals
    }

    return slots
  }
}
