const express=require('express')

const userRouter=express.Router()


const homeControllers=require('../controllers/homes')
const userController=require('../controllers/user_controller')

userRouter.get('/',homeControllers.getHomes)

userRouter.get('/login',userController.getLogin)
userRouter.post('/login',userController.postLogin)
userRouter.post('/logout',userController.postLogOut)
userRouter.get('/signup',userController.getSignup)
userRouter.post('/signup',userController.postSignup)

module.exports=userRouter
