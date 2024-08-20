// src/models/Test.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
});

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true }, // Duration in minutes
  questions: [questionSchema],
  marks: { type: Number, required: true } // Total marks for the test
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
