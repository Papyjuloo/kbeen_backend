import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/orm'
import Reservation from './Reservation.js'
import User from './User.js'

export default class QrCodeScan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare reservationId: number

  @column()
  declare userId: number

  @column()
  declare scanType: 'check_in' | 'check_out' | 'access'

  @column()
  declare deviceId: string | null

  @column.dateTime()
  declare scannedAt: DateTime

  @belongsTo(() => Reservation)
  declare reservation: BelongsTo<typeof Reservation>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
