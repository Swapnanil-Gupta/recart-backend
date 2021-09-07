import { Schema, model } from "mongoose";
import roles from "../configs/roles";

const userSchema = new Schema(
  {
    name: String,
    email: String,
    hashedPassword: String,
    role: {
      type: String,
      required: true,
      default: roles.user,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("user", userSchema);
