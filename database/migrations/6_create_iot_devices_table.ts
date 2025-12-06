import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'iot_devices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 255).notNullable()
      table.string('type', 100).notNullable()
      table.string('mac_address', 100).notNullable().unique()
      table.string('mqtt_device_id', 255).notNullable().unique()
      table.string('location', 255).nullable()
      table.integer('resource_id').unsigned().nullable()
      table.string('status', 50).notNullable().defaultTo('offline')
      table.timestamp('last_seen_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.foreign('resource_id').references('id').inTable('resources').onDelete('SET NULL')

      table.index(['resource_id', 'status'])
      table.index('mqtt_device_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
