import Recipe from "../../Models/Recipe"
import User from 'App/Models/User'


import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController{

    async index({view, auth, request }: HttpContextContract){
        const page = request.input('page', 1)
        const query = request.input('query')
        const viewMyRecipes = request.input('myrecipes')
        const limit = 8
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
        return view.render('home', {recipes} )
    }
}

