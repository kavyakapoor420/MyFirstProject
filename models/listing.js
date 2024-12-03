const mongoose = require("mongoose");
const ReviewModel = require("./ReviewModel");
const UserModel=require('./UserModel.js')
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    // required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: "listingimage"
    },
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
    }
  },
  // image: {
  //   type: String,
  //   default:
  //     "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  //   set: (v) =>
  //     v === ""
  //       ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
  //       : v,
  // },
  price: Number,
  location: String,
  country: String,
  reviews:[
  {
    type:Schema.Types.ObjectId,
    ref:"ReviewModel"
  }
],
owner:{
  type:Schema.Types.ObjectId,
  ref:"UserModel"
}
});

// if listing is deleted so its review also has to deleted so defining middleware for that
listingSchema.post('findOneAndDelete',async(listing)=>{
if(listing){
  await ReviewModel.deleteMany({_id:{$in:Listing.reviews}})
  }
})


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
