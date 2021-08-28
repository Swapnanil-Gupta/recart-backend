import mongoose from "mongoose";
import logger from "./logger";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connected to MongoDB");
  } catch (err) {
    logger.error("Unable to connect to MongoDB");
    logger.error(err);
    process.exit(1);
  }
}

export default connectDB;
