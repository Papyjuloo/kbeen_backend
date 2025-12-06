import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/orm'
import Resource from './Resource.js'
import IoTTelemetry from './IoTTelemetry.js'
import IoTLog from './IoTLog.js'

export default class IoTDevice extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare type: string // 'door_lock', 'sensor', 'camera', etc.

  @column()
  declare macAddress: string

  @column()
  declare mqttDeviceId: string

  @column()
  declare location: string | null

  @column()
  declare resourceId: number | null

  @column()
  declare status: 'online' | 'offline' | 'error'

  @column.dateTime()
  declare lastSeenAt: DateTime | null

  @belongsTo(() => Resource)
  declare resource: BelongsTo<typeof Resource>

  @hasMany(() => IoTTelemetry)
  declare telemetry: HasMany<typeof IoTTelemetry>

  @hasMany(() => IoTLog)
  declare logs: HasMany<typeof IoTLog>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
