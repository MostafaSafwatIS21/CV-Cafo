const express = require("express");
const router = express.Router();
const {
  Register,
  login,
  home,
  dashboard,
  forgetPassword,
  OTP,
  setPassword,
  resetPassword,
  error,
} = require("../controller/viewController");
const {
  isLoggedIn,
  ensureAuthenticated,
} = require("../controller/autheController");

// router.get("/", home);
router.use(isLoggedIn);
router.get("/error", error);
router.get("/login", login);
router.get("/register", Register);
router.get("/", home);
router.get("/dashboard", dashboard);
router.get("/forget-password", forgetPassword);
router.get("/OTP", OTP);
router.get("/set-password", ensureAuthenticated, setPassword);
router.get("reset-password", resetPassword);
module.exports = router;
