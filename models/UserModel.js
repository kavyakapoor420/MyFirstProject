const mongoose=require("mongoose")
const Schema=mongoose.Schema ;
const passportLocalMongoose=require('passport-local-mongoose')

const userSchema=new Schema({
    email:{
        type:String,required:true
    }
})

userSchema.plugin(passportLocalMongoose)   ;// automatically implement password hashing add username ,password to UserModel,method for authenticate etc 

const UserModel=mongoose.model("UserModel",userSchema)
module.exports=UserModel ;