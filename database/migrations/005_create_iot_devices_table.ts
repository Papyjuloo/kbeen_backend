import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'iot_devices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('device_id').notNullable().unique()
      table.string('name').notNullable()
      table.string('type').notNullable()
      table.enum('status', ['online', 'offline', 'error']).defaultTo('offline')
      table.string('location').nullable()
      table.jsonb('metadata').nullable()
      table.timestamp('last_seen_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.index('device_id')
      table.index('status')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
