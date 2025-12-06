import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/orm'
import User from './User.js'
import Reservation from './Reservation.js'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare reservationId: number

  @column()
  declare amount: number

  @column()
  declare currency: string

  @column()
  declare stripePaymentIntentId: string

  @column()
  declare status: 'pending' | 'completed' | 'failed' | 'refunded'

  @column.dateTime()
  declare paidAt: DateTime | null

  @column.dateTime()
  declare refundedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Reservation)
  declare reservation: BelongsTo<typeof Reservation>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
