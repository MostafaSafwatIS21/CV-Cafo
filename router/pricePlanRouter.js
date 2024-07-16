const express = require('express');
const pricePlanController = require('../controller/pricePlanController');
const router = express.Router()

router.post("/create-plan", pricePlanController.createPlan)
router.patch("/update-plan/:id", pricePlanController.updatePlan)

module.exports = router;