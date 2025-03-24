const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_URL}/${process.env.DB_NAME}`
    );
    console.log("connected DB");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
