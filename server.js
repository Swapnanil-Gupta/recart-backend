const express = require("express");
const morgan = require("morgan");
const connectDB = require("./configs/db");
const errorHandler = require("./middlewares/errorHandler");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

const port = process.env.PORT || 5000;
const app = express();

// ******* app config ********
// middlewares
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api/product", productRoutes);
app.use("/api/user", userRoutes);

// error handler
app.use(errorHandler);
// ******* end app config ********

connectDB();

app.listen(port, () => {
  console.log(`Express running on port ${port}`);
});
