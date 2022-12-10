const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
