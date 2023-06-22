// package imports

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));

process.on("uncaughtException", (err) => {
  console.log("uncaughtException");
  console.log(err, err.message, err.stack);
  console.log("Server shutting down");
  process.exit(1);
});

//routes

//auth Route
app.use("/auth", authRouter);

//task Route
app.use("/task", taskRouter);

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("db connected");
    })
    .catch((e) => {
      console.log("error in connection", e);
      process.exit(1);
    });
});

process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection");
  console.log(err, err.message, err.stack);
  console.log("Server shutting down");
  process.exit(1);
});
