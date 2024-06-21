const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { sendEmail } = require("../utils/sendEmail");
const ejs = require("ejs");
const path = require("path");
const { sendToken } = require("../utils/jwt");
const crypto = require("crypto");

/**
 * @abstract protect routes
 */

exports.protect = catchAsync(async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;
  let token;
  if (accessToken) {
    token = accessToken;
  } else if (refreshToken) {
    token = refreshToken;
  }
  if (!token) {
    return next(new AppError("Please log in to access resources.", 401));
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
  } catch (err) {
    return next(new AppError("Invalid token. Please log in again.", 401));
  }

  if (!decodedToken) {
    return next(new AppError("Please log in to access resources.", 401));
  }

  const user = await User.findById(decodedToken.id);

  if (!user) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }
  req.user = user;
  next();
});
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.refreshToken) {
    const decodedToken = jwt.verify(
      req.cookies.refreshToken,
      process.env.REFRESH_TOKEN
    );

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return next();
    }
    res.locals.user = user;
    return next();
  }
  return next();
});
/**
 * @abstract check if user is admin
 */
exports.isAdmin = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);

  if (user.role !== "admin") {
    return next(
      new AppError("You do not have permission to perform this action.", 403)
    );
  }
  next();
});

//

/**
 * @register
 * @method POST
 * @public
 */

// this for activate email
const activationToken = (user) => {
  const activationCode = Math.floor(1000 + Math.random() * 90).toString();

  const token = jwt.sign({ user, activationCode }, process.env.SECRET_KEY_JWT, {
    expiresIn: "15m",
  });
  return { token, activationCode };
};

exports.signup = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { name, email } = req.body;
  if (!name || !email) {
    return next(new AppError("please provide all fields", 400));
  }
  const checkEmail = await User.findOne({ email });

  if (checkEmail) {
    return next(new AppError("This account has been register before", 400));
    // res
    //   .status(201)
    //   .redirect(
    //     `/Register?message=${encodeURIComponent(
    //       `This account has been register before`
    //     )}`
    //   );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new AppError("password and confirm password not match", 400));
    // res
    //   .status(201)
    //   .redirect(
    //     `/Register?message=${encodeURIComponent(
    //       `password and confirm password not match`
    //     )}`
    //   );
  }
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };

  const activateToken = activationToken(user);
  const activationCode = activateToken.activationCode;
  const data = { user: { name: user.name }, activationCode };
  const html = await ejs.renderFile(
    path.join(__dirname, "../mails/tempalteEmail.ejs"),
    data
  );

  await sendEmail({
    email: user.email,
    subject: "Acticate your email",
    tamplate: "tempalteEmail.ejs",
    data,
  });

  res.status(201).json({
    status: "success",
    message: `check your Email Box ${user.email} to activate your account. \n it will expire at 15 Minutes`,
    token: activateToken.token,
  });
});

/**
 *@abstract activate user email before save in database
 *@method POST
 *@Private only user that signup
 */
exports.activateUser = catchAsync(async (req, res, next) => {
  const { activateCode, activateToken } = req.body;
  if (!activateCode) {
    next(new AppError("Please provide Activate code ", 400));
  }
  if (!activateToken) {
    next(
      new AppError("  Activate Token can't provide try register again  !", 400)
    );
  }
  const token = jwt.verify(activateToken, process.env.SECRET_KEY_JWT);
  if (activateCode !== token.activationCode) {
    next(new AppError("Invalid activation Code", 400));
  }

  token.user.isActive = true;

  try {
    const user = await User.create(token.user);
  } catch (error) {
    next(new AppError("something went wrong plese try again later", 500));
  }
  res.status(201).json({
    status: "success",
    message: "User Created Successfully you can login now!",
  });
});

/**
 * @abstract login users
 * @method POST
 * @Bublic
 */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("user not found", 400));
  }
  const checkPassword = await user.correctPassword(password, user.password);
  if (!checkPassword) {
    return next(new AppError("password or email not correct", 400));
  }
  user.password = undefined;

  sendToken(user, 200, res);
});

/**
 * @abstract logout users
 * @method POST
 * @private
 */

exports.logout = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const accessToken = req.cookies.accessToken;
  const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
  if (decodedToken.id !== userId) {
    next(new AppError("you are not allowed to do this action", 401));
  }

  res.cookie("accessToken", "", { maxAge: 1 });

  res.cookie("refreshToken", "", { maxAge: 1 });

  res.status(200).json({
    status: "success",
    message: "logout Successfully",
  });
});

/**
 *@abstract update user data
 *@method PATCH
 */

/**
 * @abstract update user password
 * @description user will stay logged
 * @private only user
 */
exports.updatePassword = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select("+password");
  const { currentPassword, password, confirmPassword } = req.body;

  if (!currentPassword || !password || !confirmPassword) {
    next(new AppError("please provide all fields", 400));
  }

  const checkPassword = await user.correctPassword(
    currentPassword,
    user.password
  );
  if (!checkPassword) {
    next(new AppError("password not correct", 400));
  }

  user.password = password;
  user.confirmPassword = confirmPassword;
  await user.save();

  // After saving the user, deselect the password field
  user.password = undefined;
  user.confirmPassword = undefined;
  sendToken(user, 200, res);
});

/**
 * @abstract forget password
 * @method POST
 * @public
 */
exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Please provide your email!", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }
  let resetToken;

  try {
    resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
  } catch (error) {
    return next(new AppError(error, 500));
  }

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/user/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and confirmPassword to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  const data = { user: { name: user.name }, message };

  try {
    const html = await ejs.renderFile(
      path.join(__dirname, "../mails/resetPassword.ejs"),
      data
    );

    await sendEmail({
      email: user.email,
      subject: "Reset Your Password",
      tamplate: "resetPassword.ejs",
      data,
    });

    console.log("reset token ", user.passwordResetToken);
    res.status(200).json({
      status: "success",
      message: "Token sent to email check your box!",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("something went worng", 500));
  }
});

/**
 *@abstract reset password
 @method PATCH
 */
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const hashToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  console.log(hashToken);
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  const { confirmPassword, password } = req.body;
  if (!password || !confirmPassword) {
    return next(
      new AppError("please provide password and confirmPassword", 400)
    );
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  user.password = undefined;
  user.confirmPassword = undefined;
  sendToken(user, 200, res);
});

/**
 * @abstract delete user
 * @private
 * @method DELETE
 */

exports.deleteMe = catchAsync(async (req, res, next) => {
  if (req.user.id !== req.params.Id) {
    return next(new AppError("you are not allowed to do this action", 401));
  }
  const user = await User.findByIdAndDelete(req.params.Id);
  if (!user) {
    return next(new AppError("this user not found", 401));
  }
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
/**
 * @abstract google auth
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
  });
};
exports.googleCallback = (req, res) => {
  try {
    const token = signToken(req.user._id);

    res.redirect(`/set-password`);
  } catch (error) {
    console.log(error);
  }
};

/**
 * @abstract set password for user that signup with google
 */

exports.setPassword = catchAsync(async (req, res, next) => {
  const userid = req.user._id;
  console.log("user", req.user, "body", req.body);

  console.log("user id", userid);
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword) {
    // return next(
    //   new AppError("please provide password and confirmPassword", 400)
    // );
    res
      .status(201)
      .redirect(
        `/set-password?message=${encodeURIComponent(
          `please provide password and confirmPassword`
        )}`
      );
  }
  const user = await User.findById(userid);
  if (!user) {
    return next(new AppError("user not found", 400));
  }
  user.password = password;
  user.confirmPassword = confirmPassword;
  await user.save();
  // res.status(201).json({
  //   status: "success",
  //   message: "password set successfully",
  // });
  res.redirect("/Login");
});

/**
 * @abstract middleware ensureAuthenticated
 *
 *
 *  */

module.exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("user", req.isAuthenticated());
    return next();
  }
  res.redirect("/register");
};
