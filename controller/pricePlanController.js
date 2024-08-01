const pricePlan = require("../models/pricePlanModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.createPlan = catchAsync(async (req, res, next) => {
  const newPlan = await pricePlan.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      plan: newPlan,
    },
  });
});

/**
 * @api {patch} /update-plan/:name/:duration Update a plan
 *
 *
 * */

exports.updatePlan = catchAsync(async (req, res, next) => {
  const { name, duration } = req.body;
  const updatedPlan = await pricePlan.findOneAndUpdate(
    { name, duration },
    {
      price: req.body.price,
      duration,
      features: [
        { name: "resume", quantity: req.body.resumeQuantity },
        { name: "cover letter", quantity: req.body.coverLetterQuantity },
        { name: "job tracker", quantity: req.body.jobTrackerQuantity },
        {
          name: "personal website",
          quantity: req.body.personalWebsiteQuantity,
        },
        { name: "email signature", quantity: req.body.emailSignatureQuantit },
      ],
    }
  );
  res.status(201).json({
    status: "success",
    message: "Plan updated successfully",
  });
});

/**
 * @api {get} /getPricing Get pricing
 *
 *
 * */
exports.getPricing = catchAsync(async (req, res, next) => {
  const { name, duration } = req.query;
  const plan = await pricePlan.findOne({ name, duration });

  console.log(plan);
  res.status(200).json({
    status: "success",
    plan,
  });
});
