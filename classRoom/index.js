// learning about express router 
const express=require('express')
const app=express() 
const session=require('express-session')
const path=require("path")
const flash=require('connect-flash')

const sessionOptions={
    secret:'helloWrold',
    resave:false,
    saveUninitialized:true
}

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(session(sessionOptions))
app.use(flash())

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success")
    res.locals.errMsg=req.flash("error")
    next() 
})

app.get('/register',(req,res)=>{
    let {name='anonymous'}=req.query ;
    // console.log(req.session)
    req.session.name=name ;
    if(name==='anonymous'){
        req.flash('error','user is not registered')
    }else{
    req.flash('success','user registered successfully')
    }
    res.redirect('/hello')
})
app.get('/hello',(req,res)=>{
    // res.send(`hello ${req.session.name}`)
    // res.locals.successMsg=req.flash('success')
    // res.locals.errMsg=req.flash('error')
    res.render('page.ejs',{name:req.session.name,msg:req.flash('success')})
})

app.get('/test',(req,res)=>{
    res.send('test successful')
})
app.get('/reqcount',(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1 ;
    }
    res.send(`u sent request ${req.session.count} times `)
})
// const users=require('./Routes/UserRoute.js')
// const posts=require('./Routes/PostRoute.js')
// const cookieParser = require('cookie-parser')

// app.use('/users',users)
// app.use('/posts',posts)

// app.use(cookieParser('secretCode'))

// app.get('/getSignedCookie',(req,res)=>{
//     res.cookie('made in','india',{signed:true})
//     res.send('signed cookie sent')
// })
// app.get('/getCookies',(req,res)=>{
//     res.cookie('greet','namaste');
//     res.cookie('module','india')
// })

// //verify signed cookies
// app.get('/verify',(req,res)=>{
//     console.log(req.signedCookies)
//     res.send('verified')
// })

// app.get('/greet',(req,res)=>{
//     let {name='anonymous'}=req.cookies ;
//     res.send(`hello ${name}`)
// })

// app.get( '/',(req,res)=>{
//     console.dire(res.cookie)
//     res.send('hi i m root')
// })

// app.get('/getCookies',(req,res)=>{
//     res.cookie("hello", "world")  // key value  pair

//    res.send('send you some cookies')
// })

app.listen(3000,()=>{
    console.log('server is running listening on port')
})