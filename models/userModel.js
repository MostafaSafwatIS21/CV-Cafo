const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { resetPassword } = require("../controller/userController");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    email: {
      type: String,
      unique: true,
      require: [true, "Please provide your email"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide your password "],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password "],
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      defalut: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    googleId: String,
  },
  { timestamps: true }
);

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
  } catch (err) {
    return next(err);
  }

  next();
});
userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function(
  candidatPassword,
  userPassword
) {
  return await bcrypt.compare(candidatPassword, userPassword);
};

userSchema.methods.SignAccessToken = function() {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN);
};

// sign Refresh token
userSchema.methods.SignRefreshToken = function() {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN);
};

userSchema.methods.createPasswordResetToken = function() {
  try {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // console.log(
    //   "rest Token",
    //   { resetToken },
    //   "current passwordResetToken ",
    //   this.passwordResetToken
    // );

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
  } catch (error) {
    console.log(error, "94");
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
