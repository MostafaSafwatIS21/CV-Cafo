const mongoose = require("mongoose");
const { bool } = require("sharp");

const coverLetterSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
  coverImage: String,
  letterDate: {
    trype: Date,
    default: Date.now,
  },
  recipientName: String,
  companyName: String,
  Address: String,
  body: String,
  signName: String,
  signPlace: String,
  signDate: {
    type: Date,
    default: Date.now,
  },
});
const CoverLetter = mongoose.model("CoverLetter", coverLetterSchema);

module.exports = CoverLetter;
