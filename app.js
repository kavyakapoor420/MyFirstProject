// npm i express joi  mongoose ejs nodemon method-override ejs-mate

// create public folder to serve static files like css styling, js logics with ur templates

const express=require('express')
const mongoose=require('mongoose')  
const methodOverride=require('method-override')
const ejs=require('ejs')
const path=require('path')
const ejsMate=require('ejs-mate')   // create layouts   // add this in files where u want same layout <%-layout('boilerplate)%>


const ListingModel = require('./Models/ListingModel')
const ReviewModel=require('./Models/ReviewModel.js')

const wrapAsync=require('./utils/wrapAsync.js')
const ExpressError=require('./utils/ExpressErrorClass.js')
const {listingSchema,reviewSchema}=require('./schema.js')
const {validateListing}=require('./middleware/validateListings.js')
const {validateReview}=require('./middleware/validateReview.js')

const app= express()


app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))


//middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname, '/public')))


//connecting to database
const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb-project";
async function main() {
    await mongoose.connect(MONGO_URL);
  }  

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });




// index route
app.get('/listings',wrapAsync(async(req,res)=>{
    const allListings=await ListingModel.find({})
     res.render('listings/index.ejs',{allListings})
    // return res.json(allListings)
}))

//create new listing route
app.get('/listings/new',wrapAsync(async(req,res)=>{
  res.render('listings/new.ejs')
}))

//show route -> will display particular listing
app.get('/listings/:id',wrapAsync(async(req,res)=>{
    let {id}=req.params
    const listing=await ListingModel.findById(id).populate('reviews')
    res.render('listings/show.ejs',{listing})
}))
// //create route
// app.post('/listings',async(req,res)=>{
//       try{
//         const newListing=new ListingModel(req.body.listing)
//         await newListing.save() ;
//         res.redirect('/listings')
//       }catch(err){
//         next(err)
//       }
 
//   })
// to handle async error instead of using try catch we will use wrapAsync function 

//create route
app.post('/listings',wrapAsync(async(req,res)=>{

     let result=listingSchema.validate(req.body)

    if(result.error){
      throw new ExpressError(400,result.error)
    }
    //  if(!req.body.listing){
    //    throw new ExpressError(400, "send valid data for listing")
    //  }

    const newListing=new ListingModel(req.body.listing)
    await newListing.save() ;
    res.redirect('/listings')
}))

//edit route(to edit listing)
app.get('/listings/:id/edit',wrapAsync(async(req,res)=>{
  let {id}=req.params ;
  const listing=await ListingModel.findById(id)
  res.render('listings/edit.ejs',{listing})
}))
// update route
app.put('/listings/:id',wrapAsync(async(req,res)=>{

   if(!req.body.listing){
    throw new ExpressError(400, "send valid data for listing")
  }
  let {id}=req.params
  await ListingModel.findByIdAndUpdate(id,{...req.body.listing})
 res.redirect(`/listings/${id}`)
}))
//delete route (to delete specific listing)
app.delete('/listings/:id',wrapAsync(async(req,res)=>{
  let {id}=req.params 
  await ListingModel.findByIdAndDelete(id)
  res.redirect('/listings')
}))

//Reviews

//post route when user submit form by entering some comment and give rating on show.ejs this review will submited
// also do client(form) side validation and server side validation that a valid review(comment,rating ) should be provided by user
app.post('/listings/:id/reviews',validateReview,wrapAsync(async(req,res)=>{
      const {id}=req.params ;
      let  listing=await ListingModel.findById(id)
     let newReview =new ReviewModel(req.body.review)

     listing.reviews.push(newReview)

     await newReview.save()
      await listing.save()

      console.log('new reviews saved',newReview)
      res.redirect(`/listings/${listing._id}`)
}))

// delete review route
app.delete('/listings/:id/reviews/:reviewId',wrapAsync(async(req,res)=>{
       let {id,reviewId}=req.params ;
       await ListingModel.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})

       await ReviewModel.findByIdAndDelete(reviewId)

       res.redirect(`/listings/${id}`)
}))

app.get('/',(req,res)=>{
  res.redirect('/listings')
})

// if user search some path which does not match with above path so this will work
app.all("*",(req,res,next)=>{
  next(new ExpressError(404, "Page not found"))
})

// error handling middleware
app.use((err,req,res,next)=>{
  let {statusCode=500,message='something  went wrong'}=err ;
  res.status(statusCode).render("error.ejs",{err})
  // res.status(statusCode).send(message)
})

app.listen(3000,()=>{
    console.log("server is running at port 3000")
})



// app.get('/testListing',async(req,res)=>{
//     let sampleListing=new ListingModel({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     })
//     await sampleListing.save() ;
//     console.log(sampleListing);
//     res.send('Listing saved successfully')
// })