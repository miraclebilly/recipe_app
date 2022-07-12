/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
import AuthController from '../app/Controllers/Http/AuthController';

Route.get('/', 'HomeController.index')

//Users
Route.get('/signup', 'AuthController.new').as('newUser')
Route.post('/signup', 'AuthController.create').as('createUser')

//login
Route.get('/login', 'AuthController.login')
Route.post('/login', 'AuthController.newLogin')

//logout
Route.get('/logout', 'AuthController.logout')