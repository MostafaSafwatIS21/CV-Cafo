const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  type: String,
  title: String,
  content: String,
  category: String,
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const Template = mongoose.model("Template", templateSchema);
module.exports = Template;
