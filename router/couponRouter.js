const express = require("express");
const router = express.Router();
const couponController = require("../controller/couponController");
const { protect, isAdmin } = require("../controller/autheController");

router.post("/create-coupon", protect, isAdmin, couponController.createCoupon);
router.post(
  "/update-coupon/:id",
  protect,
  isAdmin,
  couponController.updateCoupon
);
router.get("/get-coupon", protect, couponController.getCoupon);
router.get("/get-coupons", protect, couponController.getCoupons);
module.exports = router;
