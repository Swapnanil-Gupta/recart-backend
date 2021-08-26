const { Schema, model } = require("mongoose");

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

module.exports = model("refreshToken", refreshTokenSchema);
