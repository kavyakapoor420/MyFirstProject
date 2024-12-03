const express=require('express');


const wrapAsync=require('../utils/warpAsync.js')
const Listing = require('../models/listing.js');
const ExpressError=require('../utils/ExpressError.js')
const {listingSchema}=require('../schema.js');
const {isLoggedIn, isOwner,validateListing}=require('../Middleware/LoginAuthMiddleware.js')


const router=express.Router()



//index route
router.get('/',wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({}) ;
    res.render('listings/index.ejs',{allListings})
}))

//new route ->route for creating  new listing 
// router.get('/new',wrapAsync(async(req,res)=>{
//     // if a user is logged in then only he will be able to add new listing that will be check by using session (passport)
//      console.log(req.user)
//     if(!req.isAuthenticated()){
//         req.flash('error','u must be logged in to create listings')
//        return  res.redirect('/login')
//     }
//     res.render('listings/new.ejs')
// }))
//new route with isLogged in middleware added

router.get('/new',isLoggedIn,wrapAsync(async(req,res)=>{
      res.render('listings/new.ejs')
}))
// create route 
router.post('/',isLoggedIn,validateListing,wrapAsync(async(req,res)=>{
     const newListing=new Listing(req.body.listing) 
     newListing.owner=req.user._id 
     await newListing.save() ;
     req.flash('success','new listing created')
     res.redirect('/listings')
}))

//edit route
router.put('/:id/edit',isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params ;
    const listing=await Listing.findById(id) 
    if(!listing){
        req.flash('error','listing u requested to update does not exist')
        res.redirect('/listings')
    }
    res.render('listings/edit.ejs',{listing})
}))

// Authorization->if listing.owner._id ===currUser._id then this user has access to edit/delete listing

//update route
router.put('/:id',isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
      let {id}=req.params ;
      await Listing.findByIdAndUpdate(id,{...req.body.listing}) 
      req.flash('success','listing updated')
      res.redirect(`/listings/${id}`)
}))
  

//show route
router.get('/:id',wrapAsync(async(req,res)=>{
    let {id}=req.params ;
    const listing=await Listing.findById(id)
    .populate({path:"reviews",populate:{path:'author'}}).populate("owner")
      
   if(!listing){
    req.flash('error','listings u requested for does not exists')
    res.redirect('/listings') 
} 
console.log(listing)

    res.render('listings/show.ejs',{listing})
}))



// delete route
router.delete('/:id',isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params ;
    let deletedListing=await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    req.flash('success','listing deleted')
    res.redirect('/listings')
}))

module.exports=router ;