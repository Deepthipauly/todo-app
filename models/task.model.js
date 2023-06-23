
//package import
const mongoose = require("mongoose");
const { Schema } = mongoose;

//model import
require("../models/user.model");

const TASK_STATUS = {
  INPROGRESS: "INPROGRESS",
  COMPLETED: "COMPLETED",
  DELETED: "DELETED",
};

const taskSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: TASK_STATUS.INPROGRESS,
      enum: Object.values(TASK_STATUS),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  TaskModel: mongoose.model("task", taskSchema),
  TASK_STATUS,
};
