const mongoose = require("mongoose");

const coverLetterSchema = mongoose.Schema({});
const jopTracckerSchema = mongoose.Schema({});
const personalWebsiteSchema = mongoose.Schema({});
const emailSingatureSchema = mongoose.Schema({});

const Resume = mongoose.model("Resume", resumeSchema);
const Letter = mongoose.model("Letter", coverLetterSchema);
const JopTraccker = mongoose.model("JopTraccker", jopTracckerSchema);
const PersonalWebsite = mongoose.model(
  "PersonalWebsite",
  personalWebsiteSchema
);
const EmailSingature = mongoose.model("EmailSingature", emailSingatureSchema);
module.exports = {
  Resume,
  Letter,
  JopTraccker,
  PersonalWebsite,
  EmailSingature,
};
