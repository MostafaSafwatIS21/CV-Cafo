const express = require("express");
const passport = require("passport");

const router = express.Router();
const viewController = require("../controller/viewController");
const {
  signup,
  activateUser,
  login,
  logout,
  updatePassword,
  forgetPassword,
  resetPassword,
  deleteMe,
  isAdmin,
  protect,
  googleCallback,
  setPassword,
  ensureAuthenticated,
} = require("../controller/autheController");
const { getUser, getUsers } = require("../controller/userController");
const { set } = require("mongoose");
const { render } = require("ejs");
// authentication routes
router.post("/signup", signup);
router.post("/activate-account", activateUser);
router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/update-password", protect, updatePassword);
router.post("/forgot-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
router.delete("/deleteMe/:Id", protect, deleteMe);

// admin routes

router.get("/users", protect, isAdmin, getUsers);
router.get("/user/:id", protect, isAdmin, getUser);

// Google OAuth routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  googleCallback
);

router.post("/set-password", ensureAuthenticated, setPassword);

module.exports = router;
