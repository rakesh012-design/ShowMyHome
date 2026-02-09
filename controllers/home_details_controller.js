
const Home=require('../models/home')
const rootDir=require('../utils/pathUtil')
const path=require('path')

const getHomeDetails=(req,res,next)=>{
  const homeId=req.params.homeId
  
  Home.findById(homeId).then(home=>{
    
    //console.log(path.join(rootDir,'uploads',imgUrl))
    //return res.download(path.join(rootDir,'uploads',imgUrl),'image.jpg')
    res.render('home_details',{home:home,isLoggedIn:req.isLoggedIn,
      user:req.session.user
    })
  })
} 

const downloadHomeImg=async(req,res,next)=>{
  console.log('in download page')
  console.log(req.body)
  const homeId=req.body.homeId
  const home=await Home.findById(homeId)
  console.log(home)
  const imgUrl=home.ImageUrl.split("\\")[1]
  console.log(imgUrl)
  const imgName=imgUrl.split("-")[1]
  console.log(imgName)
  return res.download(path.join(rootDir,'uploads',imgUrl),`${imgName}`)
}


exports.getHomeDetails=getHomeDetails
exports.downloadHomeImg=downloadHomeImg