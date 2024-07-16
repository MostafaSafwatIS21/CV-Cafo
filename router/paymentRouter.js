const express = require("express");
const router = express.Router();

const { protect } = require("../controller/autheController");


const paymentController = require("../controller/payment");

router.post("/create-payment", protect, paymentController.createPayment);
router.get("/success", protect, paymentController.paymentSuccess);
router.get("/cancel", (req, res) => res.render("test/cancel"));

module.exports = router;
