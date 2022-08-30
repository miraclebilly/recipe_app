import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'favourites'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').notNullable().references("users.id").index().onDelete("CASCADE")
      table.integer('recipe_id').notNullable().references("recipes.id").index().onDelete("CASCADE")
      table.boolean('favourited').notNullable()
      
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.unique(['user_id', 'recipe_id'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
