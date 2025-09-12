const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: String, required: true },
  dept: { type: String, required: true },
  roll: { type: String, required: true },
  dob: { type: Date, required: true },
  marksheet: { type: String } // ✅ path to uploaded file
});

// Unique: roll + dept + year
studentSchema.index({ roll: 1, dept: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Student", studentSchema);
