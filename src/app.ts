import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./configs/db";

import loggerMiddleware from "./middlewares/logger.middleware";
import errorHandler from "./middlewares/error.middleware";

import productRoutes from "./routes/product.routes";
import userRoutes from "./routes/user.routes";
import reviewRoutes from "./routes/review.routes";

const app = express();

// ******* app config ********
// middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ALLOW_ORIGIN.split(","),
  })
);
app.use(loggerMiddleware);

// routes
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/review", reviewRoutes);

// error handler
app.use(errorHandler);
// ******* end app config ********

connectDB();

export default app;
