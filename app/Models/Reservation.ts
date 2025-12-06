import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/orm'
import User from './User.js'
import Resource from './Resource.js'
import Payment from './Payment.js'
import QrCodeScan from './QrCodeScan.js'

export default class Reservation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare resourceId: number

  @column.dateTime()
  declare startTime: DateTime

  @column.dateTime()
  declare endTime: DateTime

  @column()
  declare numberOfPeople: number

  @column()
  declare notes: string | null

  @column()
  declare status: 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled'

  @column.dateTime()
  declare checkedInAt: DateTime | null

  @column.dateTime()
  declare checkedOutAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Resource)
  declare resource: BelongsTo<typeof Resource>

  @hasMany(() => Payment)
  declare payments: HasMany<typeof Payment>

  @hasMany(() => QrCodeScan)
  declare qrCodeScans: HasMany<typeof QrCodeScan>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
