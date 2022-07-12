import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema} from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';


export default class AuthController {


    public new ({view}: HttpContextContract){
        return view.render('auth/signup')
    }

    public async create ({request, auth, response}: HttpContextContract){
        // console.log("start...")
        const validationSchema = schema.create({
            username: schema.string({trim: true}, [
               rules.unique({table: 'users', column: 'username'}),
            ]),
            email: schema.string({trim: true}, [
                rules.email(),
                rules.maxLength(255),
                rules.unique({ table: 'users', column: 'email'}),
            ]),
            password: schema.string({ trim: true}, [
                rules.confirmed(),
            ]),
        })

        const validatedData = await request.validate({
            schema: validationSchema,
        })
        const user = await User.create(validatedData)
        await user.save();
        // await auth.login(user);

        return response.redirect('/login')
    }

        public login ({view}: HttpContextContract){
            return view.render('auth/login')
        }

        public async newLogin({ request, auth, session, response}: HttpContextContract){
            const { email, password } = request.all()

            try {
                await auth.attempt(email, password)
                return response.redirect('/')
            } catch (error) {
                session.flash('auth.error', 'error')
                return response.redirect('/login')
            }
            
        }

        public async logout({ auth, session, response}: HttpContextContract){
            await auth.logout()
            session.flash({success: 'Logged out successfully'})
            return response.redirect('/login')
        }
}
