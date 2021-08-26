import { Schema, model } from "mongoose";

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

export default model("Product", productSchema);
