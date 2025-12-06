import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Reservation from './reservation.js'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column()
  declare fullName: string | null

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare phoneNumber: string | null

  @column()
  declare role: 'user' | 'admin'

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Reservation)
  declare reservations: HasMany<typeof Reservation>

  static async hashPassword(password: string) {
    return hash.make(password)
  }

  async verifyPassword(password: string) {
    return hash.verify(this.password, password)
  }
}
