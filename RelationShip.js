// learning about relationShip in mongodb one to many ,one to one

// UserModel   one to few 

const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    username:String,
    address:{
                // _id:false,
                location:String,
                city:String
    }
})
const UserModel=mongoose.model("UserModel",userSchema)

const addUsers=async()=>{
    let newUser=new UserModel({
        username:"rahul",
        address:[
            {
                location:"new delhi",city:'delhi'
            }
        ]
    })
     newUser.address.push({location:'walmart',city:'london'})

     let result=await newUser.save() 
     console.log(result)
}
addUsers()


// customers model one to many
// store a reference to child document inside parent

const orderSchema=new mongoose.Schema({
     item:String,price:Number
})

const customerSchema=new mongoose.Schema({
    name:String,
    orders:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"OrderModel"
    }
})

const OrderModel=mongoose.model("OrderModel",orderSchema)

const CustomerModel=mongoose.model("CustomerModel",customerSchema)

const addOrders=async()=>{
    let result=await OrderModel.insertMany([
        {item:'samosa',price:12},
        {item:"chips",price:10}
    ])
    console.log(result)
}

const addCustomer=async()=>{
    let customer1=new CustomerModel({
        name:"rahul"
    })
    let order1=await OrderModel.findOne({item:'chips'})
    let order2=await OrderModel.findOne({item:'samosa'})

    customer1.orders.push(order1)
    customer1.orders.push(order2)

    const result=await customer1.save()
    console.log(result)
}
const findCustomer=async()=>{
    let result=await CustomerModel.find({}).populate('orders')
    // console.log(result)
}

addOrders()

// one to many-> one to squillions
// store a reference to parent document inside child

const userSchema2=new mongoose.Schema({
    username:String,email:String
})
const postSchema=new mongoose.Schema({
    content:String,likes:Number ,
    user:{
        type:Schema.Types.ObjectId,
        ref:"UserModel2"
    }
})

const UserModel2=mongoose.model("UserModel",userSchema)
const PostModel=mongoose.model("PostModel",postSchema)


const addData=async()=>{
    let user1=new UserModel2({
        username:"rahul",email:"helloji"
    })
    // let user2=await UserModel.findOne({username:'rahul'})
    let post1=new PostModel({
        content:"hello world",likes:12
    })
    post1.user=user1

    await  user1.save()
    await post1.data()
}
const getData=async()=>{
   let result= await PostModel.findOne().populate("user",'username')
   console.lg(result)
}
addData()


const addCust=async()=>{
    let newCust=new CustomerModel({
        name:"karan"
    })
    let newOrder=new OrderModel({
        item:"pizza",price:250
    })
    newCust.orders.save() ;
    await newCust.save()
    console.log('added new customer')
}

const deleteCustomer=async()=>{
    
    let data=await CustomerModel.findByIdAndDelete(id)
}

addCust()

// mongoose middleware 
// pre -> run before query is executed
// post->run after query is executed

mongoose.Schema.pre('findOneAndDelete',async()=>{
    console.log('pre middleware')
})
mongoose.Schema.post('findOneAndDelete',async()=>{
    console.log('post middleware')
})