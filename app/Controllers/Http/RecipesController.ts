import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Recipe from 'App/Models/Recipe'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import RecipeValidator from 'App/Validators/RecipeValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules,  schema } from '@ioc:Adonis/Core/Validator'
import View from '@ioc:Adonis/Core/View';
import AuthController from './AuthController';



export default class RecipesController {


        public new({view}: HttpContextContract){
            return view.render('recipes/new')
        }

        public async create({ request, auth, session, response}: HttpContextContract){
            const recipeParams = await request.validate(RecipeValidator)
            const recipe = new Recipe();
            recipe.title = recipeParams.title
            recipe.body = recipeParams.body
            recipe.userId = auth.user?.id

            await recipe.save()
            session.flash({success: 'Recipe created successfully'})
            return response.redirect('/')     
            
        }
        // GET /recipes/:id
        public async show({params, view, auth, response }:HttpContextContract){
            const recipe = await Recipe.find(params.id)            
            return view.render('recipes/show', {recipe})
        }

        //GET /recipes/:id/edit
        public async edit({params, auth, view, response}: HttpContextContract){
            const recipe = await Recipe.findOrFail(params.id)
            if(auth.user?.id == recipe.userId){
            return view.render('recipes/edit', {recipe})              
            }else{
                return response.redirect('/')
            }
        }

        //PUT /recipes/:id
        public async update({params, view, session, request, response}: HttpContextContract){
            const recipeParams = await request.validate(RecipeValidator);
            const recipe = await Recipe.findOrFail(params.id);
            recipe.title = recipeParams.title;
            recipe.body = recipeParams.body;
            await recipe.save()
            session.flash({success: 'Recipe updated successfully'})
            return response.redirect(`/recipes/${recipe.id}`);
        }

        // DELETE /recipes/:id
        public async delete({params, auth, session, response}:HttpContextContract){
            const recipe = await Recipe.findOrFail(params.id);
            await recipe.delete();
            session.flash({error: 'Recipe deleted successfully'})
            return response.redirect('/')
        }
}
