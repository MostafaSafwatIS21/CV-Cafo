const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendEmail");
const ejs = require("ejs");
const path = require("path");
const { sendToken } = require("../utils/jwt");
const crypto = require("crypto");

/**
 * @abstract get all users
 * @route GET /api/users
 * @access private
 * @function getUsers
 */

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: users,
  });
});

/**
 * @abstract get a single user
 * @route GET /api/users/:id
 * @access private
 * @function getUser
 */
exports.getUser = catchAsync(async (req, res, next) => {
  console.log(req.params.id, "id");
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});
