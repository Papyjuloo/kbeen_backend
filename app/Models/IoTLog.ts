import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/orm'
import IoTDevice from './IoTDevice.js'

export default class IoTLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare deviceId: number

  @column()
  declare logType: 'status' | 'event' | 'command' | 'error' | 'system'

  @column()
  declare message: string

  @column()
  declare data: string | null // JSON string

  @belongsTo(() => IoTDevice)
  declare device: BelongsTo<typeof IoTDevice>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
