import Recipe from "../../Models/Recipe";

// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController{

    async index({view, request}: HttpContextContract){
        const page = request.input('page', 1)
        const limit = 8
        const recipes = await Recipe.query().orderBy('created_at', 'desc').preload('user').paginate(page, limit)
        // recipes.baseUrl('/')
        return view.render('home', {recipes} )
    }
}

