const express=require('express')
const UserModel = require('../models/UserModel.js')
const warpAsync = require('../utils/warpAsync.js')
const passport = require('passport')
const { saveRedirectUrl } = require('../Middleware/LoginAuthMiddleware.js')
const router=express.Router()


router.get('/signup',async(req,res)=>{
      res.render('users/signup.ejs')
})

router.post('/signup',warpAsync(async(req,res)=>{
    try{
        let {username,email,password}=req.body ;
        let newUser=new UserModel({
            email,username
        })
        const registeredUser=await UserModel.register(newUser,password)
        // console.log(registeredUser)
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success",'new user saved successfully') 
            res.redirect("/listings")
        })    
    }catch(err){
         req.flash('error',err.message)
         res.redirect("/signup")
        }
   
}))

router.get('/login',(req,res)=>{
    res.render('users/login.ejs')
})

router.post('/login',saveRedirectUrl,passport.authenticate('local',
    {failureRedirect:'/login',failureFlash:true}),async(req,res)=>{
          res.flash('success','welcome to wanderlust u r logged in successfully')
            // res.redirect('/listings')
            let redirectUrl=req.locals.redirectUrl || '/listings'
            // req.redirect(res.locals.redirectUrl)



})

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err)
        }
        req.flash('success','u r logged out ')
        res.redirect('/listings')
    })
})

module.exports=router ;