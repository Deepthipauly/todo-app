// package import
const express = require("express");

// file import
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/token");

const router = express.Router();

// user login
router.route("/login").post(authController.loginController);

// user register
router.route("/register").post(authController.registerController);

//userlogout

router.route("/logout").post(verifyToken, authController.logoutController);

module.exports = router;
