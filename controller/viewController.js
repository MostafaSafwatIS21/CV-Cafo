const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
exports.login = async (req, res, next) => {
  res.status(200).render("login");
};
exports.Register = async (req, res, next) => {
  res.status(200).render("Register");
};

exports.home = async (req, res, next) => {
  const decodedToken = jwt.verify(req.query.token, process.env.ACCESS_TOKEN);
  const user = await User.findById(decodedToken.id);
  res.status(200).render("test", { token: req.query.token, user: user });
};
