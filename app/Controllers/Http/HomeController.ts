import Recipe from "../../Models/Recipe"
import I18n from '@ioc:Adonis/Addons/I18n'

// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController{

    async index({view, auth, request, session }: HttpContextContract){
        const page = request.input('page', 1)
        const query = request.input('query')
        const viewMyRecipes = request.input('myrecipes')
        const limit = 8
        let recipesQuery = Recipe.query();

        if (viewMyRecipes === 'true') {
            recipesQuery = recipesQuery.where('user_id', '=', auth.user.id)
        }

        if (query) {
            recipesQuery = recipesQuery.whereILike('title', `%${query}%`)
        }

        const recipes = await recipesQuery.orderBy('created_at', 'desc').preload('user').paginate(page, limit);
    
        return view.render('home', {recipes} )
    }
}

