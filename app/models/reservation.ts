import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Payment from './payment.js'
import QrCode from './qr_code.js'

export default class Reservation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare resourceType: string

  @column()
  declare resourceId: string

  @column.dateTime()
  declare startDate: DateTime

  @column.dateTime()
  declare endDate: DateTime

  @column()
  declare status: 'pending' | 'confirmed' | 'cancelled' | 'completed'

  @column()
  declare amount: number

  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasOne(() => Payment)
  declare payment: HasOne<typeof Payment>

  @hasOne(() => QrCode)
  declare qrCode: HasOne<typeof QrCode>
}
