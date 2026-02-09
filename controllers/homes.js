const path=require('path')
const Home=require('../models/home')
const fs=require('fs')



const rootDir=require('../utils/pathUtil')
const User = require('../models/user')




const getAddHome = (req,res,next)=>{
  res.sendFile(path.join(rootDir,'views','add_home.html'))
}


const postAddHome=(req,res,next)=>{
  console.log(req.file)
  console.log(req.body)
  const {houseName,Location,rating,price,description}=req.body
  const ImageUrl=req.file.path
  const home=new Home({houseName,price, Location, rating, ImageUrl, description})
  home.save().then(()=>{
    console.log('Home Added Successfully')
    res.render('home_added',{
      houseName:home.houseName,
      Location:home.Location,
      isLoggedIn:req.isLoggedIn,
      user:req.session.user
    })
  })
  

}

const getHomes=(req,res,next)=>{
  console.log('in get Homes')
 Home.find().then(homes=>{
  res.render('home',{
    home_details:homes,isLoggedIn:req.isLoggedIn,
    user:req.session.user
  })
 })



}

const addToFavourites= async (req,res,next)=>{ 
  const userId=req.session.user.userId
  const user=await User.findById(userId)
  if (!user.favourites.includes(req.body._id)){
    user.favourites.push(req.body._id)
    await user.save()
  }
  res.redirect('/get-favourites')
}

const getFavourites=async(req,res,next)=>{
  const userId=req.session.user.userId
  const user=await User.findById(userId).populate('favourites')
  //console.log('get-favs-i',user.favourites,'from get-favs')
  res.render('favourites',{
    favHomes:user.favourites
  })
     
}

const editHome=(req,res,next)=>{
  const Id=req.params.homeId
  const editing=req.query.editing==='true'
  Home.findById(Id).then(home=>{
    res.render('edit_home',{
      home:home,
      isLoggedIn:req.isLoggedIn,
      user:req.session.user
    })
  })
}

const postEditHome=(req,res,next)=>{
  const {houseName,price,Location,rating,description,_id}=req.body
  Home.findById(_id).then((home)=>{
    home.houseName=houseName,
    home.price=price,
    home.Location=Location,
    home.rating=rating,
    home.description=description
    if(req.file){
      fs.unlink(home.ImageUrl,(err)=>{
        if (err){
          console.log(err)
        }
      })
      home.ImageUrl=req.file.path
    }
    home.save().then(()=>{
      res.redirect('/')
    }).catch((err)=>{
      console.log('error while updating',err)
    })
  }).catch((err)=>{
    console.log('error while updating',err)
  })
  
}

const deleteHomeById=(req,res,next)=>{
  const homeId=req.params.homeId
  Home.findOneAndDelete(homeId).then(()=>{
    res.redirect('/')
  }).catch((err)=>{
    console.log(err)
  })
}

const removeFavouriteById=async(req,res,next)=>{
  const userId=req.session.user.userId
  const user=await User.findById(userId).populate('favourites')
  const homeId=req.params.homeId
  //console.log(user.favourites)
  user.favourites=user.favourites.filter(fav=>fav._id!=homeId)
  await user.save()
  res.redirect('/get-favourites')
}


const controller_404=(req,res,next)=>{
  res.sendFile(path.join(rootDir,'views','404.html'))
}



exports.getAddHome=getAddHome
exports.getHomes=getHomes
exports.controller_404=controller_404
exports.postAddHome=postAddHome
exports.getFavourites=getFavourites
exports.addToFavourites=addToFavourites
exports.editHome=editHome
exports.postEditHome=postEditHome
exports.deleteHomeById=deleteHomeById
exports.removeFavouriteById=removeFavouriteById