
const mongoose=require('mongoose')
const express=require('express')
const path=require('path')
const session=require('express-session')
const MongoDBStore=require('connect-mongodb-session')(session)
const multer=require('multer')

const rootDir=require('./utils/pathUtil')
const homeControllers=require('./controllers/homes')

const app=express()
app.set('view engine','ejs')
app.set('views','views')

const dbUrl='mongodb+srv://root:root@first.uf3bqob.mongodb.net/airbnb?appName=First'

const store=new MongoDBStore({
  uri: dbUrl,
  collection: 'sessions'
})


const userRouter=require('./Routes/userRouter')
const {hostRouter}=require('./Routes/hostRouter')
const homeRouter = require('./Routes/homeRouter')




const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'uploads/')
  },
  filename:(req,file,cb)=>{
    cb(null,Date.now().toString()+'-'+file.originalname)
  }
})

const fileFilter=(req,file,cb)=>{
  if(file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg' || file.mimetype==='image/webp'){
    cb(null,true)
  }else{
    cb(null,false)
  }
}

const multerOptions={
  storage,fileFilter
}


app.use(express.static(path.join(rootDir,'public')))
app.use("/uploads",express.static(path.join(rootDir,"uploads")))
app.use(express.urlencoded())
app.use(multer(multerOptions).single('ImageUrl'))


app.use(session({
  secret:'first_session',
  resave:false,
  saveUninitialized:true,
  store:store
}))

app.use((req,res,next)=>{
  req.isLoggedIn=req.session.isLoggedIn
  next()
})

app.use(userRouter)
app.use("/host",(req,res,next)=>{
  if(req.isLoggedIn){
    return next()
  }else{
    res.redirect('/login')
  }
})
app.use('/host',hostRouter)
app.use(homeRouter)


app.use(homeControllers.controller_404)


const port=5000

mongoose.connect(dbUrl).then(()=>{
  app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`)
  })

}).catch(()=>{
  console.log('error while connecting',e)
})
