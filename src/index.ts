import dotenv from "dotenv";
dotenv.config();

import express from "express";
import loggerMiddleware from "./middlewares/loggerMiddleware";
import connectDB from "./configs/db";
import errorHandler from "./middlewares/errorHandler";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import logger from "./configs/logger";

const port = process.env.PORT || 5000;
const app = express();

// ******* app config ********
// middlewares
app.use(express.json());
app.use(loggerMiddleware);

// routes
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);

// error handler
app.use(errorHandler);
// ******* end app config ********

connectDB();

app.listen(port, () => {
  logger.info(
    `------------------Listening for requests on port ${port}--------------------`
  );
});
