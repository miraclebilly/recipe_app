import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  
  public async up () {
    this.schema.table('recipes', (table) => {
      table.string('image_url').nullable()
    })
  }

  public async down () {
    this.schema.table('recipes', (table) => {
      table.dropColumn('image_url')
    })
  }

}
