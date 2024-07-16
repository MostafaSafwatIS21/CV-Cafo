const Subscription = require("../models/subscriptionModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

/**
 * @route POST /api/v1/subscriptions
 * @desc Update subscription for user
 * @private only admin can change user subscription status
 */
exports.changeUserSubscribtion = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { duration } = req.body;

  const isValid = duration === "1-month" || duration === "1-year";
  if (!isValid || !duration) {
    return next(new AppError("provide valid duration", 400));
  }
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("User not found with this ID!", 400));
  }
  const subscription = await Subscription.findOne({ userId: id }).populate(
    "userId"
  );

  if (!subscription) {
    return next(
      new AppError(
        `this user  does not have an active subscription. As an admin, you have the permission to set up subscriptions.`,
        400
      )
    );
  }
  subscription.duration = duration;
  await subscription.save();
  res.status(201).json({
    status: "success",
    message: `User set subscriptions successfully`,
    subscription
  });
});
/**
 * @sescribe set subscribtion
 *
 * @private only admin
 * @type {(function(*, *, *): void)|*}
 */
exports.setSubscribtion = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { duration } = req.body;

  const isValid = duration === "1-month" || duration === "1-year";
  if (!isValid || !duration) {
    return next(new AppError("provide vaild duration", 400));
  }
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("User not found with this ID!", 400));
  }
  const subscription = await Subscription.create({
    userId: id,
    duration
  });

  res.status(201).json({
    status: "success",
    message: `User set subscriptions successfully`,
    subscription
  });
});

exports.setAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) {
    return next(new AppError("User not found with this ID!", 400));
  }

  user.role = "admin";
  await user.save();

  res.status(201).json({
  status:"success",
    message:"Set Admin Successfullly",
    user: user,
  })

});

exports.removeAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) {
    return next(new AppError("User not found with this ID!", 400));
  }

  user.role = "user";
  await user.save();

  res.status(201).json({
    status:"success",
    message:"Set Admin Successfullly",
    user: user,
  })

});

exports.block = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) {
    return next(new AppError("User not found with this ID!", 400));
  }
  if (user.isBlocked) {
    return next(new AppError("User already blocked", 400));
  }
  user.isBlocked = true;
  await user.save();
  res.status(201).json({
    status: "success",
    message: "User blocked successfully",
  })
})
exports.unBlock = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) {
  return next(new AppError("User not found with this ID!", 400));
}
user.isBlocked = false;
  await user.save();
  res.status(201).json({
    status: "success",
    message: "User unblocked successfully",
  })
})

exports.getUsers = catchAsync(async (req, res, next) => {})
exports.getUser = catchAsync(async (req, res, next) => {})

