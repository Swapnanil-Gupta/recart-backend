const { Schema, model } = require("mongoose");

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

module.exports = model("user", userSchema);
