const { check, validationResult } = require("express-validator")
const User=require('../models/user')
const bcrypt=require('bcryptjs')


const getLogin=(req,res,next)=>{
  res.render('login',{
    isLoggedIn:false,
    errors:[],
    oldInput:{email:""}
  })

}

const postLogin= async (req,res,next)=>{
  //req.isLoggedIn=true
  //res.cookie("isLoggedIn",true)
  const {email,password}=req.body
  console.log(req.body)
  const user=await User.findOne({email:email})
  //console.log(user)
  if(!user){
    return res.status(422).render('login',{
      isLoggedIn:false,
      errors:['invalid email or password'],
      oldInput:{email}
    })
  }
  const isMatch=await bcrypt.compare(password,user.password)
  if(!isMatch){
    return res.status(422).render('login',{
      isLoggedIn:false,
      errors:['Invalid Password'],
      oldInput:{email}
    })
  }

  req.session.isLoggedIn=true
  req.session.user={
    userId:String(user._id),
    userName:user.firstName,
    userType:user.userType,
    email:user.email,
    favourites:user.favourites
  }
  console.log(req.session.user,'from user_controller')
  await req.session.save()
  res.redirect('/')
}

const postLogOut=(req,res,next)=>{
  //res.cookie('isLoggedIn',false)
  req.session.destroy(()=>{
    res.redirect('/login')
  })
}

const getSignup=(req,res,next)=>{
  res.render('signup',{
    isLoggedIn:false,
    errors:[],
    oldInput:{firstName:"",lastName:"",userType:""}})
}
const postSignup=[
  check('firstName').trim()
  .isLength({min:2})
  .withMessage("First name should be atleast 2 characters long")
  .matches(/^[A-Za-z\s]+$/),
  check('lastName').trim()
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("First name should be atleast 2 characters long")
  ,
  check('email')
  .isEmail()
  .withMessage('please enter a valid email')
  .normalizeEmail(),
  check('password')
  .isLength({min:8})
  .withMessage('Password should be atleast 8 characters')
  .matches(/[A-Z]/)
  .withMessage('Should contain at least one upper Case')
  .matches(/[a-z]/)
  .withMessage('should match atleast one lowercase')
  .matches(/[0-9]/)
  .withMessage('should contain atleast one number')
  .matches(/[!@#$%^&*]/)
  .withMessage('should contain atleast one special character')
  .trim(),
  check('confirmPassword')
  .trim()
  .custom((value,{req})=>{
    if (value !==req.body.password){
      throw new Error("passwords do not match")
    }
    return true
  }),
  check('userType')
  .notEmpty()
  .withMessage("please select an userType")
  .isIn(['Guest','Host'])
  .withMessage('Invalid User'),
  
  (req,res,next)=>{ 
    const {firstName,lastName,email,password,confirmPassword,userType}=req.body
    const errors=validationResult(req)
    if (!errors.isEmpty()){
      return res.status(422).render('signup',{
        isLoggedIn:false,
        errors:errors.array().map(err=>err.msg),
        oldInput:{firstName,lastName,email,password,confirmPassword,userType}
      })
    }
    bcrypt.hash(password,12).then((hashedPassword)=>{
      const user=new User({firstName,lastName,email,password:hashedPassword,userType})
      return user.save()
      .then(()=>{
      res.redirect('/login')
    }).catch((err)=>{
      console.log('error while saving: ',err)
      return res.status(422).render('signup',{
        isLoggedIn:false,
        errors:[err.message],
        oldInput:{firstName,lastName,email,password,confirmPassword,userType}
      })
    })
    })

   

    
}]

exports.getLogin=getLogin
exports.postLogin=postLogin
exports.postLogOut=postLogOut
exports.getSignup=getSignup
exports.postSignup=postSignup