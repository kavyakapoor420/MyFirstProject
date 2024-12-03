const UserModel = require("../models/UserModel");


module.exports.signup=async(req,res)=>{
    try{
            let {username,email,password}=req.body ;
            const newUser=new UserModel({email,username})

            const registeredUser=await UserModel.register(newUser,password)
            // console.log(registeredUser)
            req.login(registeredUser,(err)=>{
                if(err){
                    return next(err)
                }
                req.flash('success','welcome to wanderlust')
                res.redirect('/listings')
            })
        }catch(err){
          req.flash('error',err.message)
        req.redirect('/signup')
        }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render('users/login.ejs')
}

module.exports.login=async(req,res)=>{
    req.flash('success','welcome back to wanderlust')
    let redirectUrl=res.locals.redirectUrl || '/listings' ;
    res.redirect(redirectUrl)
}
        