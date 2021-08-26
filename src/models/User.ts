import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: String,
    hashedPassword: String,
    role: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("user", userSchema);
