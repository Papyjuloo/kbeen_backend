import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'resources'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 255).notNullable()
      table.string('type', 100).notNullable()
      table.text('description').nullable()
      table.integer('capacity').notNullable().defaultTo(1)
      table.string('location', 255).nullable()
      table.decimal('price_per_hour', 10, 2).notNullable().defaultTo(0)
      table.string('status', 50).notNullable().defaultTo('available')
      table.text('amenities').nullable() // JSON string
      table.string('image_url', 500).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
