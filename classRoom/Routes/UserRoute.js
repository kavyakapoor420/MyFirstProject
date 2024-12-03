const express=require('express')
const router=express.Router()  // creates new router object

// index route
router.get('/',(req,res)=>{
    res.send('get route for users')
})
// show route
router.get('/:id',(req,res)=>{
    res.send("get route to show particular user with unique id")
})
// post route 
router.post('/',(req,res)=>{
    res.send('post for user')
})
//delete route
router.delete('/:id',(req,res)=>{
    res.send('delete route for users')
})

module.exports=router ;