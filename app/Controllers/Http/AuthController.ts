import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'



export default class AuthController {


    public new ({view}: HttpContextContract){
        return view.render('auth/signup')
    }

    public async create ({request, response}: HttpContextContract){
        const validatedData = await request.validate(CreateUserValidator)
        const user = await User.create(validatedData)
        await user.save();
        // await auth.login(user);

        return response.redirect('/login')
    }

        public async login ({response, view, auth, i18n, session}: HttpContextContract){
            try {
                await auth.authenticate()
                if (auth.isLoggedIn) {
                  session.flash({ warning: i18n.formatMessage('auth.alreadyLoggedIn')})
                  return response.redirect("/")
                }
              } catch (error) {}
          
            return view.render('auth/login')
        }

        public async newLogin({ request, auth, session, response, i18n}: HttpContextContract){
            const { email, password } = request.all()

            try {
                await auth.attempt(email, password)
                session.flash({success: i18n.formatMessage('auth.loggedSuccess')})
                return response.redirect('/')
                
            } catch (error) {
                session.flash({error: i18n.formatMessage('auth.invalidLoginError')})
                session.flash({ email })
                return response.redirect('/login')
            }
            
        }

        public async logout({ auth, session, response, i18n}: HttpContextContract){
            await auth.logout()
            session.flash({success: i18n.formatMessage('auth.loggedOut')})
            return response.redirect('/login')
        }


}
