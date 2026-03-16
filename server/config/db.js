import mongoose from "mongoose";

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    // Check if using the placeholder and switch to local if so
    if (!mongoUri || mongoUri.includes("<username>")) {
      console.log("⚠️  Placeholder or missing MONGO_URI detected. Switching to local MongoDB.");
      mongoUri = "mongodb://127.0.0.1:27017/roommate";
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
