import RecipeComment from 'App/Models/RecipeComment'
import CommentValidator from 'App/Validators/CommentValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'





export default class CommentsController {
    public async create({request, response, auth, session,i18n}: HttpContextContract){    
        
            
            const commentParams = await request.validate(CommentValidator)
            const comment = new RecipeComment()
            comment.userId = auth.user?.id as number;
            comment.recipeId = commentParams.recipe_id
            comment.comment = commentParams.comment
            await comment.save()
            session.flash({success: i18n.formatMessage('comments.flashSuccess')})
            return response.redirect('recipes/'+comment.recipeId)
    }
    //GET /comments/:id/edit
    public async edit({view, params}:HttpContextContract){
        const comment = await RecipeComment.findOrFail(params.id)
        return view.render("comments/edit", {comment})
    }

    //PUT /comments/:id
    public async update({request,response,params,session,i18n}: HttpContextContract){
        const comment = await RecipeComment.findOrFail(params.id)
        const commentParams = await request.validate(CommentValidator)
        comment.comment = commentParams.comment
        await comment.save()
        session.flash({success: i18n.formatMessage('comments.flashUpdate')})
        response.redirect(`/recipes/${comment.recipeId}`)
    }
    
        // DELETE /comments/:id/
        public async delete({params,  response, session, i18n }:HttpContextContract){
            const comment = await RecipeComment.findOrFail(params.id);
            await comment.delete();
            session.flash({error: i18n.formatMessage('comments.flashDelete')})
            response.redirect(`/recipes/${comment.recipeId}`)
        }
}
