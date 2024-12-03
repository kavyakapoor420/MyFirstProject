// as i dont want to write all of my code in app.js file it will
// get bloated so moduluar coding define routes,model in seperate file folder 

const express = require("express");
const mongoose = require("mongoose");
const ejs=require('ejs')
const path=require("path")
const methodOverride=require('method-override')
const ejsMate=require("ejs-mate")

const Listing = require("./models/listing.js");
const wrapAsync=require('./utils/warpAsync.js')
const ExpressError=require('./utils/ExpressError.js');
const {listingSchema,reviewSchema} =require('./schema.js'); 
const ReviewModel = require("./models/ReviewModel.js");

const app = express();

app.set('view engine','ejs')
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,'/public')))

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}


const validateListingSchema=(req,res,next)=>{
   let {error}=listingSchema.validate(req.body)
   if(error){
    let errMsg=error.details.map((ele)=>ele.message).join(',')
    throw new ExpressError(400,errMsg)
   }else{
    next()
   }
}
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body) 
    if(error){
      let errMsg=error.details.map((ele)=>ele.message).join(',')
      throw new ExpressError(400,errMsg)
    }else{
      next()
    }
}
// use wrapAsync in  all async middleware to handle error efficiently 


//index route
// app.get('/listings',async(req,res)=>{
//       const allListings=await Listing.find({})
//       res.render('Listings/index.ejs',{allListings})
// })

app.get('/listings',wrapAsync(async(req,res)=>{
       const allListings=await Listing.find({})
       res.render('Listings/index.ejs',{allListings})
}))


//new route
app.get('/listings/new',async(req,res)=>{
    res.render('Listings/new.ejs')
})
//create route
// app.post('/listings',async(req,res,next)=>{
//   //  const {title,price,description ,..}=req.body 
//   // or in new.ejs make key value pair listing[price] etc then

//    try{
//      const listing=req.body.listing ;
//      const newListing=await Listing(listing)
//      await newListing.save()
//      res.redirect('/listings')
//    }catch(er){
//     next(err)
//    }
// })
//instead of using try-catch using wrapAsync class which is created in utils folder to handle some errors
//create route
app.post('/listings',validateListingSchema,wrapAsync(async(req,res,next)=>{
  // if(!req.body.listing){
  //   throw new ExpressError(400,'send valid data for listing')
  // }

  //  let result=listingSchema.validate(req.body)
  // //  console.log(result)
  // if(result.error){
  //   throw new ExpressError(400,result.error)
  // }
  const listing=req.body.listing ;
  const newListing=new Listing(listing) ;
  await newListing.save() 
  res.redirect('/listings')
}))

//edit route
app.get('/listings/:id/edit',wrapAsync(async(req,res)=>{
  const {id}=req.params ;
  const listing=await Listing.findById(id)
  res.render("Listings/edit.ejs",{listing})
}))
//update route
app.put("/listings/:id",validateListingSchema,wrapAsync(async(req,res)=>{
    let {id}=req.params ;
    // if(!req.body.listing){
    //   throw new ExpressError(400,'send valid data for listing')
    // }
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`)
  }))
// delete a listing route
app.delete('/listings/:id',wrapAsync(async(req,res)=>{
  let {id}=req.params ;
 const deletedListing=await Listing.findByIdAndDelete(id)
 res.redirect('/listings')
}))
//  Post route for giving review for particular listing
app.post('/listings/:id/reviews',validateReview,wrapAsync(async(req,res)=>{
        let listing=await Listing.findById(req.params.id) ;
        let newReview=new ReviewModel(req.body.review) ;

        listing.reviews.push(newReview) ;   //listing schema has one field review which is array so push review into listing
        
        await newReview.save() ;
        await listing.save() ;

        // res.send('new review saved successfully')
        res.redirect(`/listings/${listing._id}`)
}))
//delete route for deleting particular review
app.delete('/listings/:id/reviews/:reviewId',wrapAsync(async(req,res)=>{
       let {id,reviewId}=req.params ;
       await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
       await ReviewModel.findById(reviewId) ;
       res.redirect(`/listings/${id}`)
}))
//show route
app.get('/listings/:id',wrapAsync(async(req,res)=>{
        const {id}=req.params ;
        const listing=await Listing.findById(id).populate('reviews')
        res.render("Listings/show.ejs",{listing})
        // <li><%= listing.price.toLocaleString('en-IN')%></li>
}))



app.use((err,req,res,next)=>{
    //  res.send('some error from server side')

    // for giving some custom express error use ExpressError class which is created in utils folder
    let {statusCode=500,message}=err ;
    // res.status(statusCode).send(message)
    res.status(statusCode).render("error.ejs",{err})
})

// * means match with all incoming requests

// if no route above is mention then this page not found error will rendered on frontend
// app.all("*",(req,res,next)=>{
//   next(new ExpressError(404,'Page not found'))
// })

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.listen(3000, () => {
  console.log("server is listening to port ");
})




// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });
