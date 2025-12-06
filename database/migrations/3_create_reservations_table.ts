import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reservations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().notNullable()
      table.integer('resource_id').unsigned().notNullable()
      table.timestamp('start_time', { useTz: true }).notNullable()
      table.timestamp('end_time', { useTz: true }).notNullable()
      table.integer('number_of_people').notNullable().defaultTo(1)
      table.text('notes').nullable()
      table.string('status', 50).notNullable().defaultTo('pending')
      table.timestamp('checked_in_at', { useTz: true }).nullable()
      table.timestamp('checked_out_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('resource_id').references('id').inTable('resources').onDelete('CASCADE')

      table.index(['user_id', 'status'])
      table.index(['resource_id', 'start_time', 'end_time'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
