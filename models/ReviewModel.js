import { Schema } from 'mongoose'
const mongoose=require('mongoose')

const reviewSchema=new mongoose.Schema({
     comment:String,
     rating:{
        type:Number,min:1,max:5
     },
     createdAt:{
        type:Date,
        default:Date.now()
     },
     author:{
      type:Schema.Types.ObjectId,
      ref:"UserModel"
     }
})

const ReviewModel=mongoose.model("ReviewModel",reviewSchema)

module.exports=ReviewModel 