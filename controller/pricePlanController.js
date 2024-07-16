const pricePlan = require("../models/pricePlanModel")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")


exports.createPlan = catchAsync(async (req, res, next) => {
  console.log(req.body)
    const newPlan = await pricePlan.create(req.body)
    res.status(201).json({
        status: "success",
        data: {
            plan: newPlan
        }
    })
})

/**
 * @api {patch} /update-plan/:name/:duration Update a plan
 *
 *
 * */

exports.updatePlan = catchAsync(async (req, res, next) => {
  const {id} = req.params
  console.log(id)
  const body = req.body;
  console.log(body)
    const updatedPlan = await pricePlan.findByIdAndUpdate(id,{
      price: req.body?.price,
      features: req.body?.features
    },{new: true,
      runValidators: true
    })
  res.status(201).json({
    status:"success",
    updatedPlan
  })
})