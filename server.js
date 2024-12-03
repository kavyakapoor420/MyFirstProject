// learning about middleware


const express=require('express')
const ExpressError = require('./ExpreesClassError')
const app=express()

// app.get('/admin',(req,res)=>{
//     throw new ExpressError(403,'access to admin is forbidden to user')
// })

// app.use((req,res,next)=>{
//     console.log('hi i m first middleware')
//     return next()
// })

// app.use((req,res,next)=>{
//     console.log('hi i m 2nd middleware')
//     return next()
// })

//error handling middleware 4arguments
// app.use((err,req,res,next)=>{
//     // console.error(err.stack)
//     // console.log('----error middleware 1----')
//     // // res.status(500).send('something went wrong')
//     // next(err)

//     let {status=500,message}= err;
//     res.status(status).send(message)
// })

// const checkToken=(req,res)=>{
//      let {token}=req.query 
//      if(token=='giveAccess'){
//         next()
//      }
//     //  res.send('access token is required in query')
//     throw  new  ExpressError(401,"access denied")
// }
// app.get('/api',checkToken,(req,res)=>{
//       res.send('data')
// })
// app.use((req,res,next)=>{
//     req.time=new Date(Date.now()).toString()
//     console.log(req.method,req.hostname,req.path,req.time)
//     return next()
// })

function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err))
    }
}

//create route
app.post('/chats',async(req,res,next)=>{
    try{
       let {from,to,message}=req.body ;
       let newChat=new ChatModel({
        from,to,message,created_at:new Date()
       })
       await newChat.save()
       res.redirect('/chats')
    }catch(err){
       next(err) 
    }
})

//show route
app.get('/chat/:id',async(req,res,next)=>{
    let {id}=req.params ;
    let chat=await ChatModel.findById(id)
    if(!chat){
        next(new ExpressError(404,'chat not found'))
        // throw new ExpressError(404,'chat not found')
    } 
    res.send.render('edit.ejs',{chat})
})

app.get('/',(req,res)=>{
    res.send('hi i m root')
})

// app.get('/random',(req,res,next)=>{
//     console.log('i m only for random')
//     res.send('this is random page')
// })
app.get((req,res)=>{
    res.send('page not found')
})

const handleValidationErr=(err)=>{
    console.log("validation error")
    console.dir(err.message)
    return err;
}
app.use((req,res,next,err)=>{
    console.log(err.name) ;
    if(err.name==="validation error"){
        err=handleValidationErr(err)
    }
    next(err)
})

app.listen(3001,()=>{
    console.log('connected to Database')
})