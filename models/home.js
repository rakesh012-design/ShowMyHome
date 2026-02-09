const mongoose=require('mongoose')



const homeSchema=mongoose.Schema({

  houseName:{type:String,required: true},
  price:{type:Number,required:true},
  Location:{type:String,required:true},
  rating:{type:Number,required:true},
  ImageUrl:{type:String},
  description:{type:String}

})



module.exports=mongoose.model('Home',homeSchema)