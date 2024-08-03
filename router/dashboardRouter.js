const express = require("express");
const router = express.Router();
const dashboardController = require("../controller/dashboardController");
const { protect, isAdmin } = require("../controller/autheController");
const pricePlanController = require("../controller/pricePlanController");

// router.post("/changeUserSubscribe/:id",protect,isAdmin,dashboardController.changeUserSubscribtion)
// router.post("/setSubscribe/:id",protect,isAdmin,dashboardController.setSubscribtion)
router.post("/set-admin/:id", protect, isAdmin, dashboardController.setAdmin);
router.post(
  "/remove-admin/:id",
  protect,
  isAdmin,
  dashboardController.removeAdmin
);
// for change or create plan
router.post("/create-plan", pricePlanController.createPlan);
router.post("/update-plan", pricePlanController.updatePlan);

router.get("/get-users", protect, isAdmin, dashboardController.getUsers);
router.get("/get-user/:id", protect, isAdmin, dashboardController.getUser);

// router.get("/get-subscriptions",protect,isAdmin,dashboardController.getSubscriptions)
// router.get("/get-subscription/:id",protect,isAdmin,dashboardController.getSubscription)
// router.get("/get-all-subscriptions",protect,isAdmin,dashboardController.getAllSubscriptions)

module.exports = router;
