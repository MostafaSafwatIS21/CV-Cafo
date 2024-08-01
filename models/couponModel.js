const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const couponSchema = new Schema({
  code: {
    type: String,
    required: [true, "Coupon Name is required"],
    maxlength: 8,
    minlength: 8,
    trim: true,
    unique: true,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  expirationDate: {
    type: Date,
    required: true,
    set: function(value) {
      if (typeof value === "string") {
        return parseExpiration(value);
      }
      return value;
    },
  },
});

couponSchema.pre("save", function(next) {
  this.code = this.code.toUpperCase();

  next();
});

function parseExpiration(input) {
  const regex = /(\d+m(?![a-zA-Z]))?\s*(\d+w)?\s*(\d+d)?\s*(\d+h)?\s*(\d+min)?/;
  const matches = input.match(regex);

  if (!matches) {
    throw new Error("Invalid expiration date format.");
  }

  const now = new Date();
  const months = matches[1] ? parseInt(matches[1]) : 0;
  const weeks = matches[2] ? parseInt(matches[2]) : 0;
  const days = matches[3] ? parseInt(matches[3]) : 0;
  const hours = matches[4] ? parseInt(matches[4]) : 0;
  const minutes = matches[5] ? parseInt(matches[5]) : 0;

  now.setMonth(now.getMonth() + months);
  now.setDate(now.getDate() + weeks * 7 + days);
  now.setHours(now.getHours() + hours);
  now.setMinutes(now.getMinutes() + minutes);

  return now;
}

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
