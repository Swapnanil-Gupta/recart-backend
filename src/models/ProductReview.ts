import { Schema, model } from "mongoose";

// TODO: Add title to reviews
const productReviewSchema = new Schema(
  {
    productId: Schema.Types.ObjectId,
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    review: String,
    rating: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("productreview", productReviewSchema);
