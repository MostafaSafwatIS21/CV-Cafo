const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const template = require("../models/templateModel");
const { protect, isLoggedIn } = require("../controller/autheController");
const PlanPrice = require("../models/pricePlanModel")
const AppError = require("../utils/AppError");

exports.login = async (req, res, next) => {
  if (req.cookies.accessToken || req.cookies.refreshToken) {
    return res.redirect("/dashboard");
  }
  res.status(200).render("Login");
};
exports.Register = async (req, res, next) => {
  if (req.cookies.accessToken || req.cookies.refreshToken) {
    return res.redirect("/dashboard");
  }
  res.status(200).render("Register");
};
exports.home = async (req, res, next) => {
  res.status(200).render("index");
};
exports.dashboard = async (req, res, next) => {
  const user = res.locals.user;
  const resume = await template.find({ type: "resume" });
  res.status(200).render("dashboard", { user, resume });
};
exports.forgetPassword = async (req, res, next) => {
  res.status(200).render("ForgetPassword");
};

exports.OTP = async (req, res, next) => {
  const { message, token } = req.query;

  res.render("OTP", { message, token });
};

exports.setPassword = async (req, res, next) => {
  res.render("set-password");
};

exports.resetPassword = async (req, res, next) => {
  const { token } = req.params;
  res.render("reset-password", { token });
};
exports.changePassword = async (req, res, next) => {
  res.render("change-password");
};

exports.error = async (req, res, next) => {
  res.render("error");
};

/**
 * @abstract    Get all the templates
 *
 **/

exports.ourStory = async (req, res, next) => {
  res.render("Pages/our-story");
};

exports.coverBuilder = async (req, res, next) => {
  res.render("Pages/Cover-letter-builder");
};
exports.coverTemplate = async (req, res, next) => {
  res.render("Pages/Cover-letter-templates");
};
exports.emailSignature = async (req, res, next) => {
  res.render("Pages/Email-Signature");
};
exports.emailSignatureTemplate = async (req, res, next) => {
  res.render("Pages/Email-Signature-Templates");
};
exports.jobTracker = async (req, res, next) => {
  res.render("Pages/Job-Tracker");
};
exports.personalWebsite = async (req, res, next) => {
  res.render("Pages/Personal-Website");
};
exports.pricing = async (req, res, next) => {
  const year= await PlanPrice.find({duration:"year"}).sort({name:1})
  const month= await PlanPrice.find({duration:"month"}).sort({name:1})
  // console.log(year.features[0].quantity)

  console.log(month[0].features[2].quantity)
  res.render("Pages/pricing",{
    year,month
  });
};

exports.privacyPolicy = async (req, res, next) => {
  res.render("Pages/Privacy_policy");
};
exports.resumeBuilder = async (req, res, next) => {
  res.render("Pages/Resume-builder");
};
exports.resumeTemplates = async (req, res, next) => {
  res.render("Pages/Resume-templates");
};
exports.terms = async (req, res, next) => {
  res.render("Pages/terms");
};
exports.websiteTemplates = async (req, res, next) => {
  res.render("Pages/Website-Templates");
};

exports.write = async (req, res, next) => {
  res.render("write");
};
exports.write_1 = async (req, res, next) => {
  res.render("write1");
};

//test
exports.payment = async (req, res, next) => {
  res.render("test/create");
};
exports.payment__new = async (req, res, next) => {
  res.render("test/payment");
};
