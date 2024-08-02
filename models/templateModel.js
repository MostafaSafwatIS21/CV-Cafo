const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the name of the template"],
    unique: true,
  },
  type: {
    type: String,
    enum: [
      "resume",
      "cover letter",
      "job tracker",
      "personal website",
      "email signature",
    ],
    required: [true, "Please provide the type of the template"],
  },
  cover: {
    type: String,
    required: true,
  },
  userId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  isFree: {
    type: Boolean,
    default: false,
  },
  classified: {
    type: String,
    enum: ["modern", "classic", "creative", "professional"],
    required: [true, "Please provide the classification of the template"],
  },
  htmlFile: {
    type: String,
    required: true,
  },
});

const Template = mongoose.model("Template", templateSchema);
module.exports = Template;
