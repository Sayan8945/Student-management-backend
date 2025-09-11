const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gmail: { type: String, required: true, unique: true },
  teacherId: { type: Number, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model("Teacher", teacherSchema);
