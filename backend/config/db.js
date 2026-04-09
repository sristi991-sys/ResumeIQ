import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI missing in .env");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "fairhire", 
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);

    
    setTimeout(connectDB, 5000);
  }
};