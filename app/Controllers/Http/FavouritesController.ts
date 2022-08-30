import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FavouriteValidator from 'App/Validators/FavouriteValidator'
import Favourite from 'App/Models/Favourite'



export default class FavouritesController {
    public async like({request, response, auth}: HttpContextContract){
        
        const favouriteParams = await request.validate(FavouriteValidator)
        let favourite = new Favourite()
        favourite.userId = auth.user?.id as number;
        favourite.recipeId = favouriteParams.recipe_id

        const currentUserFavourite = await Favourite.query().where('recipe_id', '=', favouriteParams.recipe_id).where('user_id', '=', auth.user?.id).first()
        if(currentUserFavourite){
         favourite = currentUserFavourite   
        }

        favourite.favourited = true
        await favourite.save()

        return response.redirect('/recipes/'+favourite.recipeId)
                     
        
    }

    public async dislike({params, request,auth, response}: HttpContextContract){
        const favouriteParams = await request.validate(FavouriteValidator)
        let favourite = new Favourite()
        favourite.userId = auth.user?.id as number;
        favourite.recipeId = favouriteParams.recipe_id

        const currentUserFavourite = await Favourite.query().where('recipe_id', '=', favouriteParams.recipe_id).where('user_id', '=', auth.user?.id).first()
        if(currentUserFavourite){
         favourite = currentUserFavourite   
        }

        favourite.favourited = false
        await favourite.save()

        return response.redirect('/recipes/'+favourite.recipeId)
        
        
    }
}
