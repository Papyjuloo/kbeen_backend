import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'iot_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('device_id').unsigned().notNullable()
      table.string('log_type', 50).notNullable()
      table.text('message').notNullable()
      table.text('data').nullable() // JSON string
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.foreign('device_id').references('id').inTable('iot_devices').onDelete('CASCADE')

      table.index(['device_id', 'log_type', 'created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
