import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'iot_telemetry'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('device_id').unsigned().notNullable()
      table.decimal('temperature', 5, 2).nullable()
      table.decimal('humidity', 5, 2).nullable()
      table.integer('battery_level').nullable()
      table.integer('signal_strength').nullable()
      table.text('data').nullable() // JSON string
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.foreign('device_id').references('id').inTable('iot_devices').onDelete('CASCADE')

      table.index(['device_id', 'created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
