import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Recipe from 'App/Models/Recipe'
import RecipeValidator from 'App/Validators/RecipeValidator'
import { v2 as cloudinary } from 'cloudinary'



export default class RecipesController {


        public new({view}: HttpContextContract){
            return view.render('recipes/new')
        }

        public async create({ request, auth, session, response, i18n}: HttpContextContract){
            // Validations
            const image = request.file('image', {
                size: '500kb',
                extnames: ['jpg', 'png'],
            })
            const imageIsInvalid = !image || !image.isValid;
            if(imageIsInvalid){ 
                session.flash({
                    imageError: i18n.formatMessage('recipes.imageError')
                });
            }
            const recipeParams = await request.validate(RecipeValidator)
            if (imageIsInvalid) {
                session.flash({...recipeParams });
                return response.redirect('/recipes/new');
            }

            // assign properties
            const recipe = new Recipe();
            recipe.title = recipeParams.title
            recipe.body = recipeParams.body
            recipe.userId = auth.user?.id as number

            // image upload
            cloudinary.config()
            try{
                 const result =  await cloudinary.uploader.upload(image.tmpPath as string)             
                recipe.imageUrl = result.url
            }
            catch(error){
                //handle the error
            }

            await recipe.save()
            session.flash({success: i18n.formatMessage('recipes.flashSuccess')})
            return response.redirect('/')     
            
        }
        // GET /recipes/:id
        public async show({params, view }:HttpContextContract){
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
        public async update({params, session, request, response, i18n}: HttpContextContract){
            //image validator
            const image = request.file('image', {
                size: '500kb',
                extnames: ['jpg', 'png'],
            })
            const imageIsInvalid = !image || !image.isValid;
            if(imageIsInvalid){
                session.flash({imageError: i18n.formatMessage('recipes.imageError')})
            }
            
            const recipe = await Recipe.findOrFail(params.id);

            const recipeParams = await request.validate(RecipeValidator);
            if (imageIsInvalid){
                session.flash({...recipeParams});
                return response.redirect(`/recipes/${recipe.id}/edit`);
                
            }
            
            //assign properties
            recipe.title = recipeParams.title;
            recipe.body = recipeParams.body;

            
            //image upload
            cloudinary.config()

            try{
                 const result =  await cloudinary.uploader.upload(image.tmpPath as string)             
                recipe.imageUrl = result.url
            }
            catch(error){
                //handle the error
            }

            await recipe.save()
            session.flash({success: i18n.formatMessage('recipes.flashUpdate')})
            return response.redirect(`/recipes/${recipe.id}`);
        }

        // DELETE /recipes/:id
        public async delete({params, session, response, i18n}:HttpContextContract){
            const recipe = await Recipe.findOrFail(params.id);
            await recipe.delete();
            session.flash({error: i18n.formatMessage('recipes.flashDelete')})
            return response.redirect('/')
        }
}
