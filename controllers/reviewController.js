const Listing=require('../models/listing.js')
const ReviewModel=require('../models/ReviewModel.js')


module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id) ;
    let newReview=new ReviewModel(req.body.review) 

    newReview.author=req.user._id ;

    listing.reviews.push(newReview) ;

    await newReview.save() ;
    await listing.save() ;

    req.flash('success','new review created') 
    req.redirect(`/listings/${listing._id}`)
}

module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params ;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await ReviewModel.findByIdAndDelete(reviewId) 

    req.flash('success','review deleted')
    res.redirect(`/listings/${id}`)
}