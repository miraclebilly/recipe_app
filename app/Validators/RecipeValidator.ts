import { schema } from '@ioc:Adonis/Core/Validator'

export default class RecipeValidator {
    public schema = schema.create({
        title: schema.string({trim:true}),
        body: schema.string({trim: true}),        
    })
}