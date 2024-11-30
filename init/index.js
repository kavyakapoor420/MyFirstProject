const mongoose=require('mongoose');
const initData=require('./data')
const ListingModel=require('../Models/ListingModel.js')


//connecting to database
const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb-project";
async function main() {
    await mongoose.connect(MONGO_URL);
  }  

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });


const initDb=async()=>{
    await ListingModel.deleteMany({})
    await ListingModel.insertMany(initData.data)
    console.log("initialized db with sample data")
}
initDb()