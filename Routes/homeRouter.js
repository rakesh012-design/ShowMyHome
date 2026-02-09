const express=require('express')
const  getHomeDetailsController  = require('../controllers/home_details_controller')
const homeController=require('../controllers/homes')

const homeRouter=express.Router()


homeRouter.get('/home/:homeId',getHomeDetailsController.getHomeDetails)
homeRouter.post('/favourites',homeController.addToFavourites)
homeRouter.get('/get-favourites',homeController.getFavourites)
homeRouter.get('/edit-home/:homeId',homeController.editHome)
homeRouter.post('/home_edited',homeController.postEditHome)
homeRouter.post('/get-favourites/:homeId',homeController.removeFavouriteById)
homeRouter.post('/download-image',getHomeDetailsController.downloadHomeImg)

module.exports=homeRouter 