import dotenv from "dotenv";
dotenv.config();

import express from "express";
import loggerMiddleware from "./middlewares/logger.middleware";
import connectDB from "./configs/db";
import errorHandler from "./middlewares/error.middleware";
import productRoutes from "./routes/product.routes";
import userRoutes from "./routes/user.routes";
import reviewRoutes from "./routes/review.routes";
import logger from "./configs/logger";
import cors from "cors";

const port = process.env.PORT || 5000;
const app = express();

// ******* app config ********
// middlewares
app.use(express.json());
app.use(
  cors({
    origin: "*",
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

app.listen(port, () => {
  logger.info(
    `------------------Listening for requests on port ${port}--------------------`
  );
});
