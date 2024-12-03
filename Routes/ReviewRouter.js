const express=require('express')
const warpAsync = require('../utils/warpAsync');
const Listing = require('../models/listing');
const ReviewModel = require('../models/ReviewModel');
const {listingSchema,reviewSchema}=require('../schema.js')
const ExpressError=require('../utils/ExpressError.js')

const {validateReview, isLoggedIn}=require('../Middleware/LoginAuthMiddleware.js')

const router=express.Router({mergeParams:true}) 

// const validateReview=(req,res,next)=>{
//     let {error}=reviewSchema.validate(req.body) 
//     if(error){
//         let errMsg=error.details.map((ele)=>ele.message).join('')
//     }else{
//         next() 
//     }
// }
//Reviews post route 
router.post('/',isLoggedIn,validateReview,warpAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id)
    let newReview=new ReviewModel(req.body.review)

      newReview.author=req.user._id 

    listing.reviews.push(newReview)

    await newReview.save() 
    await listing.save() 
    req.flash('success','new review is created')
    res.redirect(`/listings/${listing._id}`)
}))
// delete route for review
router.delete('/:reviewId',warpAsync(async(req,res)=>{
    let {id,reviewId}=req.params ;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await ReviewModel.findByIdAndDelete(reviewId);
    
    req.flash('success','review deleted successfully')
    res.redirect(`/listings/${id}`)
}))

module.exports=router 