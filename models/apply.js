const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  skills: String,
  github: String,
  projectLink: String,
  problemSolved: String,
  company: String,
});

module.exports = mongoose.model("apply", applicationSchema);