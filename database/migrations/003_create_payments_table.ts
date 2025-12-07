import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('reservation_id').unsigned().references('id').inTable('reservations').onDelete('CASCADE')
      table.string('stripe_payment_intent_id').notNullable().unique()
      table.decimal('amount', 10, 2).notNullable()
      table.string('currency').notNullable().defaultTo('eur')
      table.enum('status', ['pending', 'succeeded', 'failed', 'refunded']).defaultTo('pending')
      table.string('payment_method').nullable()
      table.jsonb('metadata').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.index('reservation_id')
      table.index('stripe_payment_intent_id')
      table.index('status')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
