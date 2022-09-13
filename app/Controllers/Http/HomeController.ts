import Recipe from "../../Models/Recipe"
import User from 'App/Models/User'
import Favourite from 'App/Models/Favourite'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController{

    async index({view, auth, request }: HttpContextContract){
        const page = request.input('page', 1)
        const query = request.input('query')
        const viewMyRecipes = request.input('myrecipes')
        const limit = 9
        let recipesQuery = Recipe.query();
        let userQuery = User.query();
        

        if (viewMyRecipes === 'true') {
            recipesQuery = recipesQuery.where('user_id', '=', auth.user?.id as number)
        }

        if (query) {
            const users = await userQuery.whereILike('username', `%${query}%`)
            recipesQuery = recipesQuery.whereILike('title', `%${query}%`).orWhereIn('user_id', users.map(user => user.id))
        }
        const recipes = await recipesQuery.orderBy('created_at', 'desc').preload('user').paginate(page, limit);
        
        const popularRecipesResult =await Favourite.query().select('recipe_id').count('recipe_id as recipe_count').groupBy('recipe_id').orderBy('recipe_count', 'desc').limit(5)
        const popularRecipeIds = popularRecipesResult.map(result => result.recipeId)
        // To get an array of the most liked recipe in descending order
        const popularRecipes = await Recipe.query().whereIn('id', popularRecipeIds)
                                    .orderByRaw(popularRecipeIds.map(recipeId => `id = ${recipeId} desc`).join(', ')).preload('user')
        return view.render('home', {recipes, popularRecipes} )
    }
}

