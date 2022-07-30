import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RecipeValidator {
    public schema = schema.create({
        title: schema.string({trim:true}),
        body: schema.string({trim: true}),        
    })
}