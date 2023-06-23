// package import
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// model import
const { UserModel } = require("../models/user.model");
const { TokenModel, TOKEN_STATUS } = require("../models/token.model");

// file import
const { isemail } = require("../helper/validator");

const register = async (registerData) => {
  const { email, password } = registerData;
  if (!email) throw new Error("email is required");
  if (!isemail(email)) throw new Error("invalid email");
  if (!password) throw new Error("password is required");

  // find email exist
  const isemailExist = await UserModel.countDocuments({ email });
  if (isemailExist) throw new Error("email already exists");

  // hashing the password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  // create new user
  const newUser = await UserModel.create({
    email,
    password: hashedPassword,
  });
  console.log("new User created", newUser);
  return {
    email: newUser.email,
    userId: newUser._id,
  };
};

const login = async (loginData) => {
  const { email, password } = loginData;
  if (!email) throw Error("email is required");
  if (!isemail(email)) throw Error("invalid email");
  if (!password) throw Error("password is required");
  // check is user registered
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("user not registered");

  // verifying password
  const isPasswordVerified = await bcrypt.compare(password, user.password);
  if (!isPasswordVerified) throw new Error("incorrect password");

  //JWT token generation
  const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_KEY);
  // storing generated token
  const storedTokenDetails = await TokenModel.findOneAndUpdate(
    { user: new mongoose.Types.ObjectId(user._id) },
    {
      token,
      status: TOKEN_STATUS.ACTIVE,
      user: new mongoose.Types.ObjectId(user._id),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("storedTokenDetails", storedTokenDetails);
  return {
    token,
    userId: user._id,
    email: user.email,
  };
};

const logout = async (userId) => {
  const storedTokenDetails = await TokenModel.findOneAndUpdate(
    { user: new mongoose.Types.ObjectId(userId) },
    {
      status: TOKEN_STATUS.DELETED,
      user: new mongoose.Types.ObjectId(userId),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("storedTokenDetails", storedTokenDetails);
};

module.exports = { register, login, logout };
