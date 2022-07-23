import Recipe from "../../Models/Recipe";

// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController{

    async index({view}: HttpContextContract){
        const recipes = await Recipe.query().orderBy('created_at', 'desc').preload('user')
        return view.render('home', {recipes} )
    }
}

