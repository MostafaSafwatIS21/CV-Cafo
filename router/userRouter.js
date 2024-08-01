const express = require("express");
const passport = require("passport");
const { sendTokenFormGoogle } = require("../utils/jwt");
const router = express.Router();
const autheController = require("../controller/autheController");
const userController = require("../controller/userController");
const User = require("../models/userModel");

router.use(autheController.updateLastActive);
// authentication routes
router.post("/signup", autheController.signup);
router.post("/activate-account", autheController.activateUser);
router.post("/login", autheController.login);
router.post("/logout", autheController.protect, autheController.logout);
router.post(
  "/update-password",
  autheController.protect,
  autheController.updatePassword
);
router.post("/forgot-password", autheController.forgetPassword);
router.post("/reset-password/:token", autheController.resetPassword);
router.delete(
  "/deleteMe/:Id",
  autheController.protect,
  autheController.deleteMe
);
// Google OAuth routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/dashboard" }),
  (req, res) => {
    console.log(req.user);
    if (req.user.newer) {
      return res.redirect("/set-password");
    }
    sendTokenFormGoogle(req.user, 200, res);
  }
);

router.post(
  "/set-password",
  autheController.ensureAuthenticated,
  autheController.setPassword
);

// user routes

router.patch(
  "/updateMe",
  autheController.protect,
  userController.uploadImage,
  userController.resizeImage,
  userController.updateMe
);

module.exports = router;
