import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.info("Connected to MongoDB");
  } catch (err) {
    console.error("Unable to connect to MongoDB");
    console.error(err);
    process.exit(1);
  }
}

export default connectDB;
