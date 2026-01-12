import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // MUST be before db connection

const MONGOURI = process.env.MONGODB_URI;
const dbname = process.env.DB_NAME;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGOURI, { dbname: dbname });
    console.log("connect to mongodb successfully:");
  } catch (error) {
    console.error("mongodb connection error:", error);
    process.exit(1);
  }
};

export default connectToDatabase;
