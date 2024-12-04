const express=require('express')
const app=express()

const ExpressError=require('./ExpressErrorClass.js')

app.get('/admin',(req,res)=>{
    throw new ExpressError(403,"access to admin is forbidden")
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message='some error'}=err ;
    res.status(statusCode).send(message)
})

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})