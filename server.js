const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Student = require("./models/student");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect MongoDB
mongoose.connect("mongodb+srv://sayanpub2020:8945097611@student-marksheet.t7zdeqq.mongodb.net/?retryWrites=true&w=majority&appName=student-marksheet");

// ✅ API: Search student by name + roll number
app.post("/api/students/search", async (req, res) => {
  const { name, studentClass, rollNumber } = req.body;

  try {
    const student = await Student.findOne({
      name,
      class: studentClass,
      rollNumber,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/add", async (req, res) => {
  try {
    const { rollNumber, name, className, marks } = req.body;

    if (!rollNumber || !name || !className) {
      return res.status(400).json({ message: "Name, Roll Number, and Class are required!" });
    }

    const student = new Student({ rollNumber, name, className, marks });
    await student.save();

    res.json({ message: "Student added successfully!", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
