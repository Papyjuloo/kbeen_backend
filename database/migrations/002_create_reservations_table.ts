import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reservations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('resource_type').notNullable()
      table.string('resource_id').notNullable()
      table.timestamp('start_date', { useTz: true }).notNullable()
      table.timestamp('end_date', { useTz: true }).notNullable()
      table.enum('status', ['pending', 'confirmed', 'cancelled', 'completed']).defaultTo('pending')
      table.decimal('amount', 10, 2).notNullable()
      table.text('notes').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.index(['user_id', 'status'])
      table.index('start_date')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
