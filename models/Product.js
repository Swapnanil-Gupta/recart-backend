const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: String,
    description: String,
    price: Number,
    countInStock: Number,
    imageUrl: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Product", productSchema);
