const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user.model");
const { isemail } = require("../helper/validator");
const { TokenModel, TOKEN_STATUS } = require("../models/token.model");
const jwt = require("jsonwebtoken");

const register = async (registerData) => {
  const { email, password } = registerData;

  if (!email) throw new Error("email is required");
  if (!isemail(email)) throw new Error("invalid email");
  if (!password) throw new Error("password is required");

  // find user is already present in db
  //countdocuments used to findone in db

  const isemailExist = await UserModel.countDocuments({ email });
  if (isemailExist) throw new Error("email already exists");

  // hashing password
  // salt= random value
  //gensalt() --> function in bcrypt, which creates random value

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  //To create new user

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

  // check is user present

  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("user not registered");

  // verifying password
  const isPasswordVerified = await bcrypt.compare(password, user.password);
  if (!isPasswordVerified) throw new Error("incorrect password");

  //token generate when login

  const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_KEY);

  const storedTokenDetails = await TokenModel.findOneAndUpdate(
    // mongoose.types.objectId used to make user._id to mongoose Id

    { user: new mongoose.Types.ObjectId(user._id) }, // filter for findOneandUpdate
    {
      token,
      status: TOKEN_STATUS.ACTIVE,
      user: new mongoose.Types.ObjectId(user._id),
    },

    // upsert is given here as true value. we used upsert here to make token for the new users,
    // if they dont have token it will make a new user and create token. in case of new users in their first login.

    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("storedTokenDetails", storedTokenDetails);
  return {
    token,
    userId: user._id,
    accountType: user.accountType,
    email: user.email,
  };
};

const logout = async (userId) => {
  const isTokenExist = await TokenModel.countDocuments({
    user: new mongoose.Types.ObjectId(userId),
    status: TOKEN_STATUS.ACTIVE,
  });
  if (!isTokenExist) throw new Error("Jwt Token Expired.Pls login now");
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
