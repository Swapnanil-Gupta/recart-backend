import { Schema, model } from "mongoose";

const refreshTokenSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export default model("refreshToken", refreshTokenSchema);
