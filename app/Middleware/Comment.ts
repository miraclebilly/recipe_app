import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RecipeComment from 'App/Models/RecipeComment'


export default class CommentMiddleware {
  public async handle({auth, response, params}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const comment = await RecipeComment.findOrFail(params.id)
    
    if(auth.user?.id !== comment.userId){
      return response.redirect('/')
    }
    await next()
  }
}
