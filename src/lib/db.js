import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

let cachedConnection = null;

export async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(uri);
    cachedConnection = connection;
    return connection;
  } catch (error) {
    console.error("Mongoose connection error:", error);
    throw error;
  }
}