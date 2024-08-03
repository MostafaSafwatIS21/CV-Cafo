const mongoose = require("mongoose");

const personalWebsiteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
    coverImage: String,
    personalDetails: {
      name: String,
      email: String,
      jobTitle: String,
      phone: String,
      address: String,
      photo: String,
    },
    design: {
      colors: String,
      fonts: String,
    },
  },
  { timestamps: true }
);
const PersonalWebsite = mongoose.model(
  "PersonalWebsite",
  personalWebsiteSchema
);
module.exports = PersonalWebsite;
