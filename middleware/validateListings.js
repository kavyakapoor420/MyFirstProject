
const ExpressError=require('../utils/ExpressErrorClass.js')
let {listingSchema}=require('../schema.js')

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body)
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(',')
         throw new ExpressError(400, errMsg)
    }else{
        next()
    }
}