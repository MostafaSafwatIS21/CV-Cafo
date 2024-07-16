const express = require("express");
const router = express.Router();
const viewController = require("../controller/viewController");
const {
  isLoggedIn,
  ensureAuthenticated,
  protect,
} = require("../controller/autheController");

// router.get("/", home);
router.use(isLoggedIn);
router.get("/error", viewController.error);
router.get("/login", viewController.login);
router.get("/register", viewController.Register);
router.get("/", viewController.home);
router.get("/dashboard", viewController.dashboard);
router.get("/forget-password", viewController.forgetPassword);
router.get("/OTP", viewController.OTP);
router.get("/set-password", ensureAuthenticated, viewController.setPassword);
router.get("/reset-password/:token", viewController.resetPassword);
router.get("/change-password", protect, viewController.changePassword);

// pages
router.get("/our-story", viewController.ourStory);
router.get("/Cover-letter-builder", viewController.coverBuilder);
router.get("/Cover-letter-templates", viewController.coverTemplate);
router.get("/Email-Signature", viewController.emailSignature);
router.get("/Email-Signature-Templates", viewController.emailSignatureTemplate);
router.get("/Job-Tracker", viewController.jobTracker);
router.get("/Personal-Website", viewController.personalWebsite);
router.get("/pricing", viewController.pricing);
router.get("/Privacy", viewController.privacyPolicy);
router.get("/Resume-builder", viewController.resumeBuilder);
router.get("/Resume-templates", viewController.resumeTemplates);
router.get("/terms", viewController.terms);
router.get("/Website-Templates", viewController.websiteTemplates);
router.get("/Write", viewController.write);
router.get("/Write_1", viewController.write_1);
router.get("/payment", viewController.payment);
router.get("/payment__new", viewController.payment__new);

module.exports = router;
