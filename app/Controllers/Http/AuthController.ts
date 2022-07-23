import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Recipe from 'App/Models/Recipe'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules,  schema } from '@ioc:Adonis/Core/Validator'
import View from '@ioc:Adonis/Core/View';



export default class AuthController {


    public new ({view}: HttpContextContract){
        return view.render('auth/signup')
    }

    public async create ({request, auth, response}: HttpContextContract){
        const validatedData = await request.validate(CreateUserValidator)
        const user = await User.create(validatedData)
        await user.save();
        // await auth.login(user);

        return response.redirect('/login')
    }

        public async login ({view, auth}: HttpContextContract){
            try {
                await auth.authenticate()
                if (auth.isLoggedIn) {
                  session.flash({ warning: 'Already logged in' })
                  return response.redirect("/")
                }
              } catch (error) {}
          
            return view.render('auth/login')
        }

        public async newLogin({ request, auth, session, response}: HttpContextContract){
            const { email, password } = request.all()

            try {
                await auth.attempt(email, password)
                session.flash({success: 'Logged in successfully'})
                return response.redirect('/')
                
            } catch (error) {
                session.flash({error: 'Invalid email and/or password'})
                session.flash({ email })
                return response.redirect('/login')
            }
            
        }

        public async logout({ auth, session, response}: HttpContextContract){
            await auth.logout()
            session.flash({success: 'Logged out successfully'})
            return response.redirect('/login')
        }


}
