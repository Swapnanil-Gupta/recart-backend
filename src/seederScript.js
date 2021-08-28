const connectDB = require("./configs/db");
const { Product } = require("./models/Product");
const products = require("./data/products");

async function importData() {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("Data import successful");
    process.exit();
  } catch (err) {
    console.error("Unable to import data");
    console.error(err);
    process.exit(1);
  }
}

connectDB();
importData();
