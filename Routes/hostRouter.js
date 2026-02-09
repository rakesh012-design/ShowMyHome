const express=require('express')
const bodyParser=require('body-parser')



const hostRouter=express.Router()



const homeControllers=require('../controllers/homes')
const homeDetailsController=require('../controllers/home_details_controller')

hostRouter.get('/add-home',homeControllers.getAddHome)
hostRouter.use(bodyParser.urlencoded())
hostRouter.post('/home_added',homeControllers.postAddHome)
hostRouter.post('/delete-home/:homeId',homeControllers.deleteHomeById)



exports.hostRouter=hostRouter
