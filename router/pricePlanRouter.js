const express = require("express");
const router = express.Router();
const { protect } = require("../controller/autheController");
const { getPricing } = require("../controller/pricePlanController");

router.get("/getPricing", protect, getPricing);
module.exports = router;
