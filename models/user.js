const mongoose=require('mongoose')


const userSchema=mongoose.Schema({
  firstName:{
    type:String,
    required:[true,'First name is required']
  },
  lastName:String,
  email:{
    type:String,
    required:[true,'the email is required'],
    unique:true
  },
  password:{
    type:String,
    required:[true,'the password is required']
  },
  userType:{
    type:String,
    enum:['Host','Guest'],
    default:'Guest'
  },
  favourites:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Home'
  }]
})


module.exports=mongoose.model('User',userSchema)