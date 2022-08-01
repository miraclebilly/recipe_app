import Recipe from "../../Models/Recipe";

// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController{

    async index({view, request}: HttpContextContract){
        const page = request.input('page', 1)
        const query = request.input('query', '')
        const limit = 8
        const recipes = await Recipe.query().whereILike('title', `%${query}%`).orderBy('created_at', 'desc').preload('user').paginate(page, limit)
        // recipes.baseUrl('/')
        return view.render('home', {recipes} )
    }
}

