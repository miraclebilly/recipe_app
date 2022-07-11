import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema} from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'


export default class AuthController {


    public new ({view}: HttpContextContract){
        return view.render('auth/signup')
    }

    public async create ({request, auth, response}: HttpContextContract){
        console.log("start...")
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
        console.log(validatedData)
        const user = await User.create(validatedData)
        console.log(user)
        await user.save();
        // await auth.login(user);

        return response.redirect('/')
    }

}
