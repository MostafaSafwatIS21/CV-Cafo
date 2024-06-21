const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { protect, isLoggedIn } = require("../controller/autheController");
const AppError = require("../utils/AppError");

// exports.home = async (req, res, next) => {
//   const decodedToken = jwt.verify(req.query.token, process.env.ACCESS_TOKEN);
//   const user = await User.findById(decodedToken.id);
//   res.status(200).render("test", { token: req.query.token, user: user });
// };

exports.login = async (req, res, next) => {
  const message = req.query.message || "";
  res.status(200).render("Login", { message });
};
exports.Register = async (req, res, next) => {
  const message = req.query.message || " ";
  res.status(200).render("Register", { message });
};
exports.home = async (req, res, next) => {
  res.status(200).render("index");
};
exports.dashboard = async (req, res, next) => {
  const user = res.locals.user;
  res.status(200).render("dashboard", { user });
};
exports.forgetPassword = async (req, res, next) => {
  res.status(200).render("ForgetPassword");
};

exports.OTP = async (req, res, next) => {
  const { message, token } = req.query;

  res.render("OTP", { message, token });
};

exports.setPassword = async (req, res, next) => {
  res.render("set-password");
};

exports.resetPassword = async (req, res, next) => {
  const { token } = req.params;
  res.render("ResetPassword", { token });
};

exports.error = async (req, res, next) => {
  res.render("error");
};
