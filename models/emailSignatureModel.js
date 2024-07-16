const mongoose = require("mongoose");

const emailSignatureSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
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
const EmailSignature = mongoose.model("EmailSignature", emailSignatureSchema);

module.exports = EmailSignature;
