import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from "App/Models/User"


export default class RecipeComment extends BaseModel {
  //public static table = 'recipe_comments'

  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public recipeId: number

  @column()
  public comment: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
  
}

