const mongoose = require("mongoose");
const Student = require("./models/Student");

mongoose.connect("mongodb://127.0.0.1:27017/marksheetDB");

const students = [
  {
    rollNumber: "101",
    name: "John Doe",
    className: "10",
    marks: { math: 85, science: 90, english: 78, computer: 92 },
  },
  {
    rollNumber: "102",
    name: "Alice Smith",
    className: "10",
    marks: { math: 70, science: 88, english: 95, computer: 80 },
  },
  {
    rollNumber: "103",
    name: "Bob Johnson",
    className: "12",
    marks: { math: 92, science: 81, english: 85, computer: 89 },
  },
];

async function seedData() {
  try {
    await Student.deleteMany(); // clear old data
    await Student.insertMany(students);
    console.log("✅ Sample students inserted!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

seedData();
