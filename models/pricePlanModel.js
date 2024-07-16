const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const featureSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique:true,
    enum: [
      "resume",
      "cover letter",
      "job tracker",
      "personal website",
      "email signature",
    ],
  },
  quantity: {
    type: Number,
    required: true,
  }
}, { _id: false });
// Define the PricingPlan schema
const pricingPlanSchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: ['Basic', 'Pro', 'Premium'] ,// Example plan names
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
    enum: ['month', 'year'] // Could be 'month' or 'year'
  },
  features: [featureSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the PricingPlan model
const PricingPlan = mongoose.model('PricingPlan', pricingPlanSchema);

module.exports = PricingPlan;
