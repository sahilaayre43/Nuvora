const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URI || process.env.MONGODB_URL;
    if (!mongoUrl) {
      throw new Error("MONGODB_URI or MONGODB_URL must be set");
    }

    await mongoose.connect(mongoUrl);
    console.log("MongoDB connected successfully");
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`, { cause: error });
  }
};

module.exports = connectDB;