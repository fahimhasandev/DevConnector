// mongodb connection
const mongoose = require('mongoose');
// const db = config.get('mongoURI');
const dotenv = require('dotenv');
//const db = process.env.MONGODB_URI;
// Load environment variables
dotenv.config();

// connect to mongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {});
    //await mongoose.connect(db); // since it is a promise
    console.log('MongoDB Connected....');
  } catch (error) {
    console.log(error.message);

    //Exist process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
