import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class IotDevice extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare deviceId: string

  @column()
  declare name: string

  @column()
  declare type: string

  @column()
  declare status: 'online' | 'offline' | 'error'

  @column()
  declare location: string | null

  @column()
  declare metadata: Record<string, any>

  @column.dateTime()
  declare lastSeenAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
