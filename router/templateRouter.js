const express = require("express");
const templateController = require("../controller/templateController");
const { protect, isAdmin } = require("../controller/autheController");
const { authenticate } = require("passport");

const router = express.Router();

router.post(
  "/createTemplate",
  protect,
  templateController.uploadCover,
  templateController.resizeImage,
  templateController.createTemplate
);

router.get(
  "/getAllTemplates",
  protect,
  isAdmin,
  templateController.getAllTemplates
);
router.delete(
  "/deleteTemplate",
  protect,
  isAdmin,
  templateController.deleteTemplate
);

router.get("/resume", templateController.getAllResume);
router.get("/cover-letter", templateController.getAllCoverLetter);
router.get("/email-signature", templateController.getAllEmailSignature);
router.get("/personal-website", templateController.getAllPortofilio);
router.get("/job-tracker", templateController.getAllJobTracker);

module.exports = router;
