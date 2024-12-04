const ExpressError=require('../utils/ExpressErrorClass.js')
const {reviewSchema}=require('../schema.js')


module.exports.validateReview=async(req,res,next)=>{
     let {error}=reviewSchema.validate(req.body)
     
     if(error){
        let errMsg=error.details.map((el)=>el.message).join(',')
        throw new ExpressError(400,errMsg)
     }else{
        next()
     }
}