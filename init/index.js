const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  // Add the owner field to each object in initData
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6728adf16737d2bae9ddad43"
  }));

  // Insert data into the collection
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
