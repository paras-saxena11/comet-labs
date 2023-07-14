const mongoose = require("mongoose");

// Define the Question schema using Mongoose
const questionSchema = new mongoose.Schema({
  name: String,
  masterjudgeId: Number,
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
