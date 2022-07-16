import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Recipe from 'App/Models/Recipe'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules,  schema } from '@ioc:Adonis/Core/Validator'
import View from '@ioc:Adonis/Core/View';



export default class RecipesController {


        public new({view}: HttpContextContract){
            return view.render('recipes/new')
        }

        public async create({ request, auth, session, response}: HttpContextContract){
            const recipeSchema = schema.create({
                title: schema.string({ trim: true }),
                body: schema.string({ trim: true }),
                
            })
            const recipeParams = await request.validate({schema: recipeSchema});
            const recipe = new Recipe();
            recipe.title = recipeParams.title
            recipe.body = recipeParams.body
            recipe.userId = auth.user?.id

            await recipe.save()
            session.flash({success: 'Recipe created successfully'})
            return response.redirect('/')         
            
           
        }
}
