const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  company: String,
  question: String,
  options: [String],
  answer: String,
});

module.exports = mongoose.model("question", QuestionSchema);