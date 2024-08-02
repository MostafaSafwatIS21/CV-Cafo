const Coupon = require("../models/couponModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.createCoupon = catchAsync(async (req, res, next) => {
  const { code, value, expirationDate } = req.body;
  if (!code || !value || !expirationDate) {
    return next(new AppError("Please provide all the required fields"));
  }
  const coupon = await Coupon.create(req.body);
  await coupon.save();

  res.status(200).json({
    status: "success",
    message: "Coupon created",
  });
});

exports.updateCoupon = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateFields = {};

  if (req.body.code) {
    updateFields.code = req.body.code;
  }
  if (req.body.expirationDate) {
    updateFields.expirationDate = req.body.expirationDate;
  }
  if (req.body.value) {
    updateFields.value = req.body.value;
  }

  const updateCoupon = await Coupon.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });
  console.log("Updated", updateCoupon);
  res.status(200).json({
    status: "success",
    message: "Coupon Updated",
    data: {
      updateCoupon,
    },
  });
});

exports.deleteCoupon = catchAsync(async (req, res, next) => {
  const { code } = req.params;
  const coupon = await Coupon.findOne({ code });

  if (!coupon) {
    next(new AppError("Coupon Not found"));
  }

  const deleteCoupon = await Coupon.findOneAndDelete({ code });

  res.status(200).json({
    status: "success",
    message: "Coupon Deleted",
    data: {
      deleteCoupon,
    },
  });
});

exports.getCoupon = catchAsync(async (req, res, next) => {
  const { code } = req.body;
  console.log(req.body);
  const coupon = await Coupon.findOne({ code });

  if (!coupon) {
    return next(new AppError("Couopn not valid or expire"));
  }

  res.status(200).json({
    status: "success",
    message: "valid coupon",
    data: {
      coupon,
    },
  });
});
exports.getCoupons = catchAsync(async (req, res, next) => {
  const coupons = await Coupon.find();

  if (!coupons) {
    return next(new AppError("Couopn not valid or expire"));
  }

  res.status(200).json({
    status: "success",
    message: "valid coupon",
    coupons,
  });
});
