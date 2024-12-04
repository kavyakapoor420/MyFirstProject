// it will have 3 fields (comment->string,rating(1 to 5)->Number,createdAt->date,time)

const mongoose=require('mongoose');

const reviewSchema=new mongoose.Schema({
    comment: String,
    rating: {
        type:Number,
        min:1,
        max:5
    },
    created_at:{
        type:Date,
        default:Date.now()
    }
})


const ReviewModel=mongoose.model('ReviewModel',reviewSchema)


module.exports=ReviewModel;