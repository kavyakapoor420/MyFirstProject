const express=require('express')
const app=express() 

app.use((req,res,next)=>{
    console.log('hi ,i m first middleware')
    next() ;  //considered as end of middleware
})

app.use((req, res, next)=>{
    console.log('hi, i m second middleware')
    next() ;
})
app.use((req,res)=>{
    res.status(404).send('page not found')
})

//logger utility middleware function

// app.use((req,res,next)=>{
//     req.time=new Date(Date.now()).toString() //return exact current  time,date 
//     console.log(req.method,req.path,req.originalUrl)
//     next()
// })

const checkToken=('/api',(req,res,next)=>{
    let {token}=req.query ;
    if(token==='giveAccess'){
        next()
    }
    res.send("access denied ")
})

app.get('/api',checkToken,(req,res)=>{
     res.send(data)
})

app.get('/',(req,res)=>{
    res.send('root is working')
})

app.listen(3000,()=>{
    console.log('app is listening on port')
})