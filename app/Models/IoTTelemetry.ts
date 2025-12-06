import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/orm'
import IoTDevice from './IoTDevice.js'

export default class IoTTelemetry extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare deviceId: number

  @column()
  declare temperature: number | null

  @column()
  declare humidity: number | null

  @column()
  declare batteryLevel: number | null

  @column()
  declare signalStrength: number | null

  @column()
  declare data: string | null // JSON string for additional data

  @belongsTo(() => IoTDevice)
  declare device: BelongsTo<typeof IoTDevice>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
