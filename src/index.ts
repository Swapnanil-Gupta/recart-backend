require("dotenv").config();

import express from "express";
import morgan from "morgan";
import connectDB from "./configs/db";
import errorHandler from "./middlewares/errorHandler";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";

const port = process.env.PORT || 5000;
const app = express();

// ******* app config ********
// middlewares
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);

// error handler
app.use(errorHandler);
// ******* end app config ********

connectDB();

app.listen(port, () => {
  console.log(`Express running on port ${port}`);
});
