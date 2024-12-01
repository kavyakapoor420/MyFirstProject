// npm i express mongoose ejs nodemon method-override ejs-mate

// create public folder to serve static files like css styling, js logics with ur templates

const express=require('express')
const mongoose=require('mongoose')  
const methodOverride=require('method-override')
const ejs=require('ejs')
const path=require('path')
const ejsMate=require('ejs-mate')   // create layouts   // add this in files where u want same layout <%-layout('boilerplate)%>


const ListingModel = require('./Models/ListingModel')

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
app.get('/listings',async(req,res)=>{
    const allListings=await ListingModel.find({})
     res.render('listings/index.ejs',{allListings})
    // return res.json(allListings)
})

//create new listing route
app.get('/listings/new',async(req,res)=>{
  res.render('listings/new.ejs')
})
// create route-> (route to create listing)
app.post('/listings',async(req,res)=>{
    const newListing=new ListingModel(req.body.listing)
    await newListing.save() 
    res.redirect('/listings')
})

//show route -> will display particular listing
app.get('/listings/:id',async(req,res)=>{
    let {id}=req.params
    const listing=await ListingModel.findById(id)
    res.render('listings/show.ejs',{listing})
})
//edit route(to edit listing)
app.get('/listings/:id/edit',async(req,res)=>{
  let {id}=req.params ;
  const listing=await ListingModel.findById(id)
  res.render('listings/edit.ejs',{listing})
})
// update route
app.put('/listings/:id',async(req,res)=>{
  let {id}=req.params
  await ListingModel.findByIdAndUpdate(id,{...req.body.listing})
 res.redirect(`listings/${id}`)
})
//delete route (to delete specific listing)
app.delete('/listings/:id',async(req,res)=>{
  let {id}=req.params 
  await ListingModel.findByIdAndDelete(id)
  res.redirect('/listings')
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