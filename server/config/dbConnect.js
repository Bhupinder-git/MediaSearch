// Import mongoose
const mongoose = require('mongoose');

// importing environement variables
require('dotenv').config();

// function to establish db connection
async function dbConnect(){
    console.log("Attempting MongoDB connection");
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('✅ MongoDB connected successfully.');
    }catch(err){
        console.log('❌ Error connecting db :',err.message);
        console.log("Trying connection in 5 seconds...");
        setTimeout(dbConnect, 5000);
    }
};

// exporting it
module.exports = dbConnect;