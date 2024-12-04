const mongoose=require('mongoose')

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/RelationModel')
}

main().then(()=>{c
    console.log('connected to db')
}).catch((err)=>{
    console.log(err)
})

// one to few relation     one to may approach 1
const userSchema=new mongoose.Schema({
    username:String,
    addresses:[
        {
            location:String,
            city:String
        }
    ]
})

const UserModel=mongoose.model('UserModel',userSchema)

const addUser=async()=>{
    let user1=new UserModel({
        username:'Ridhima kapoor',
        addresses:[
            {
                // _id:false,
                location:'sector 12',
                city:'noida'
            }
        ]
    })
    user1.addresses.push({location:'sector 24',city:'delhi'})
    let result=await user1.save()
    console.log(result)
}

addUser() 

// ont to  many // approach1 
const orderSchema=new mongoose.Schema({
   item:String,price:Number
})

const OrderModel=mongoose.model("OrderModel",orderSchema)

const addOrder=async()=>{
    let orders=await OrderModel.insertMany([
        {item:'pizza',price:120},
        {item:'burger',price:20},
        {item:'coke',price:50}
    ])
      console.log(orders)
}
addOrder()

const customerSchema=new mongoose.Schema({
      username:String,
      orders:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"OrderModel"   // objectId will reference will come from which collection
        }
      ]
})

const CustomerModel=mongoose.model("CustomerModel",customerSchema)

const addCustomer=async()=>{
    let customer1=new CustomerModel({
        name:"kavya "
    })
    let order1=await OrderModel.findOne({item:'pizza'});
    let order2=await OrderModel.findOne({item:'burger'});

    customer1.orders.push(order1)
    customer1.orders.push(order2)

    let result=await customer1.save() 
    console.log(result)

    let allCustomer=await CustomerModel.find({}).populate('orders')
   console.log(allCustomer[0])
}

addCustomer()


// one to many(squillions)

const userSchema3=new mongoose.Schema({
    username:String,email:String
})

const UserModel3=mongoose.model('UserModel3',userSchema3)

const postSchema3=new mongoose.Schema({
    content:String,likes:Number,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserModel3"
    }
})

const PostModel3=mongoose.model('PostModel3', postSchema3)

const addData=async()=>{
    let user1=new UserModel3({
        username:'Ridhima kapoor',
        email:'rk@gmail.com'
    })
    let post1=new PostModel3({
        content:'hello world',likes:100
    })

    post1.user=user1 
    await user1.save() 
    await post1.save() 

}
const getData=async()=>{
    let result=await PostModel3.findOne({}).populate("user")
    console.log(result)
}

addData() 



const addCust=async()=>{
    let newCust=new CustomerModel({
        name:"rakesh"
    })
    let newOrder=new OrderModel({
        item:"MacBurger",price:20
    })

    newCust.orders.push(newOrder)
    await newOrder.save()
    await newCust.save() 
    console.log("added new customer")
}

addCust()

// we want if a customer is deleted then its order has to also deleted
const delCust=async()=>{
    let deletedCust=await CustomerModel.findByIdAndDelete()
    console.log(deletedCust)
}

delCust() 


customerSchema.post('findOneAndDelete',async(customer)=>{
    if(customer.orders.length>0){
        let res=await OrderModel.deleteMany({_id:{$in:customer.orders}})
        console.log(res)
    }
})