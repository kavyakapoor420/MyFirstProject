const Listing=require('../models/listing.js');
const { listingSchema, reviewSchema } = require('../schema');
const ExpressError = require('../utils/ExpressError');


module.exports.isLoggedIn=(req,res,next)=>{
    // console.log(req.path,'...',req.originalUrl)
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl ;// used for post-login page . whatever path user was trying to access but will get redirected to login page .so after successfuly logged in he will redirected to same path which he is trying to acess to
        req.flash('error','u must be logged in user ')
        return res.redirect('/login')
    }
    next() 
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next() 
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params ;
    let listing=await Listing.findById(id) ;
    if(!listing.owner.equals(req.locals.currUser._id)){
        req.flash('error','u r not owner of this listing')
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body )
    if(error){
        let errMsg=error.details.map((ele)=>ele.message).join(',')
        throw new ExpressError(404,errMsg)
    }else{
        next() 
    }
}

module.exports.validReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body ) ;
    if(error){
        let errMsg=error.details.map((ele)=>ele.message).join(',')  ;
        throw new ExpressError(404,errMsg)
    }else{
        next() 
    }
// }
// module.exports.isReviewAuthor=async(req,res,next)=>{
//     let {id,reviewId}=req.params ;