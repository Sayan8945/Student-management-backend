const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  className: { type: Number, required: true },
  marks: {
    math: Number,
    science: Number,
    english: Number,
    computer: Number,
  },
});

module.exports = mongoose.model("Student", studentSchema);
