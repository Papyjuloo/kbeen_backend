import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().notNullable()
      table.integer('reservation_id').unsigned().notNullable()
      table.decimal('amount', 10, 2).notNullable()
      table.string('currency', 10).notNullable().defaultTo('usd')
      table.string('stripe_payment_intent_id', 255).notNullable().unique()
      table.string('status', 50).notNullable().defaultTo('pending')
      table.timestamp('paid_at', { useTz: true }).nullable()
      table.timestamp('refunded_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('reservation_id').references('id').inTable('reservations').onDelete('CASCADE')

      table.index(['user_id', 'status'])
      table.index('stripe_payment_intent_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
