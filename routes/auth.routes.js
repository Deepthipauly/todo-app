const express = require("express");
const router = express.Router();

// user login
router.route("/login").post(authController.loginController);

// user register
router.route("/register").post(authController.registerController);

//userlogout

router.route("/logout").post(verifyToken, authController.logoutController);

module.exports = router;
