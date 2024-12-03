import express from 'express'
const app=express() 
import mongoose from 'mongoose'
import path from 'path'
import ejsMate from 'ejs-mate'
import session from 'express-session'
import flash from 'connect-flash'
import localStrategy from 'passport-local'
import passport from 'passport'
import methodOverride from 'method-override'
import user from '../../NestQuest/models/user'


app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,'/public')))


const sessionOptions={
    secret:"abcd",resave:false,  saveUninitialized: true,
    cookie:{
        maxAge:1*24*60*60*1000,
        expiresIn:Date.now()+1*24*60*60*1000,
        httpOnly:true
    }
}
app.use(methodOverride('_method'))
app.use(flash())
app.use(session(sessionOptions))

app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error');
    res.locals.currentUser=req.user ;

     next() ;
})

//signup route 
app.get('/signup',(req,res)=>{
    res.render('user/signup.ejs')
})
//post route for signup 
app.post('/signup',async(req,res)=>{
    let {username,email,password}=req.body ;
    const newUser=new user({email,password})
     const registeredUser=await user.register(newUser,password)
      req.login(registeredUser,(err)=>{
         if(err){
            next(err)
         }
         res.redirect('/listings')
      })  
})
//get route for login
app.get('/login',(req,res)=>{
     res.render('user/login.ejs')
})
//post route for login
app.post('/login',passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),async(req,res)=>{
      let {email,password}=req.body ;
      
})