import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'qr_code_scans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('reservation_id').unsigned().notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.string('scan_type', 50).notNullable()
      table.string('device_id', 255).nullable()
      table.timestamp('scanned_at', { useTz: true }).notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.foreign('reservation_id').references('id').inTable('reservations').onDelete('CASCADE')
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')

      table.index(['reservation_id', 'scan_type'])
      table.index('scanned_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
