import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/orm'
import Reservation from './Reservation.js'
import IoTDevice from './IoTDevice.js'

export default class Resource extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare type: string

  @column()
  declare description: string | null

  @column()
  declare capacity: number

  @column()
  declare location: string | null

  @column()
  declare pricePerHour: number

  @column()
  declare status: 'available' | 'unavailable' | 'maintenance'

  @column()
  declare amenities: string | null // JSON string

  @column()
  declare imageUrl: string | null

  @hasMany(() => Reservation)
  declare reservations: HasMany<typeof Reservation>

  @hasMany(() => IoTDevice)
  declare iotDevices: HasMany<typeof IoTDevice>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
