// package import
const mongoose = require("mongoose");


const { Schema } = mongoose;

const USER_STATUS = {
  ACTIVE: "ACTIVE",
  DELETED: "DELETED",
};

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  UserModel: mongoose.model("user", userSchema),
  USER_STATUS,
};
