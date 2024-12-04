const mongoose=require('mongoose');

const ReviewModel=require('../Models/ReviewModel.js')


const listingSchema=new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    image:{
        filename: { type: String, default: "default.jpg" },
         url: {
        type: String,
        default: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        set: (v) =>
            v === ""
                ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
                : v,
    },
    },
    price: {type: Number},
    location:String,
    country: String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"ReviewModel"
        }
    ]
   
})
//post mongoose middleware to delete reviews if particular listing is deleted  then reviews corresponding to it will also be deleted
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await ReviewModel.deleteMany({_id:{$in:listing.reviews}})
    } 
})

const ListingModel=mongoose.model('ListingModel',listingSchema)

module.exports=ListingModel;