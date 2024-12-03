// windows shift s for taking screenshot


// stateless protocol->does not require server to retain server information eg HTTP
// stateful protocol->require  server to save  status and session information  eg FTP

//passport-local
// passport strategy for authenticating with username and password

// connect-flash
// it is special area of session used for storing message.messages are written to flash and cleared after being displayed to user

// require all dependency like express,mongoose,path,method-override,ejs-mate,passport,passport-local,passport-local-mongoose

const express=require('express')
const mongoose=require('mongoose')
const path=require('path')
const methodOverride=require('method-override')
const ejsMate=require('ejs-mate')
const cookieParser=require('cookie-parser')
const flash=require('connect-flash')
const expressSession=require('express-session')
const passport=require('passport')
const LocalStrategy=require('passport-local')
const User=require('./models/UserModel.js')

const ExpressError=require('./utils/ExpressError.js')

// require routes from Route folder
const ListingRouter=require('./Routes/ListingRouter.js')
const ReviewRouter=require('./Routes/ReviewRouter.js')
const UserRouter=require('./Routes/UserRouter.js')

const app=express()

const sessionOption={
  secret:'mysecret',
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*2460*60*1000, // milliseconds for 7days,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
}

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

// all necessary middleware 
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname,'public')))
app.engine('ejs',ejsMate)
app.use(cookieParser())
// res.flash(key,'message which has to flashed')
app.use(flash())
app.use(expressSession(sessionOption)) 
// login credential of same user should be saved in one session so there is no need to login again
app.use(passport.initialize())  ;// middleware that initializes passport
app.use(passport.session())    ;// a web app need the ability to identify users as they browse from page to page. this series of requests and responses each associated with sma user is known as session

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// connect to database
async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
}
main().then(()=>console.log('connected to db'))
.catch((err)=>console.log(err))

// connect flash middleware
app.use((req, res, next) => {
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    res.locals.currUser=req.user  ;// session relates information of current user
    next();
});

// app.get('/demouser',async(req,res)=>{
//   let fakeUser=new User({
//     email:"hello",username:"123"
//   })
//   let registeredUser=await User.register(fakeUser,'hello') ;
//   res.send(registeredUser)
// })

app.use('/listings',ListingRouter)
//but this id will be valid in app.js file only but we want to use in ReviewRouter
//router=express.Router({mergeParams:true})
app.use('/listings/:id/reviews',ReviewRouter)
app.use('/',UserRouter)

app.get("/", (req, res) => {
  res.redirect("/listings");
});

// app.get('/',(req,res)=>{
//   res.send('hello from root')
// })

//page not found route ->if user search on route which does not match with above route or it does not exist
app.all('*',(req,res,next)=>{
  next(new ExpressError(404,'page not found'))
})
// error handling middleware
app.use((err,req,res,next)=>{
  let {statusCode=500,message='something went wrong'}=err ;
  res.status(statusCode).render('error.ejs',{err})

  //  res.status(statusCode).send(message)
})

app.listen(3000,()=>{
  console.log('app is listening on port')
})