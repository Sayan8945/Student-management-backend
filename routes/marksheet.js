const express = require("express");
const upload = require("../config/clodinaryUpload");
const path = require("path");
const fs = require("fs");
const Student = require("../models/student");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

// ✅ Middleware to check if teacher is logged in
function ensureTeacher(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "teacher") {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized. Teacher login required." });
}
// ✅ Student-only middleware
function ensureStudent(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "student") {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized. Student login required." });
}



// ✅ Teacher-only route to upload marksheet
router.post("/upload-marksheet", ensureTeacher, upload.single("marksheet"), async (req, res) => {
  try {
    const { year, dept, roll } = req.body;

    if (!year || !dept || !roll) {
      return res.status(400).json({ error: "Year, Dept and Roll are required" });
    }

    const student = await Student.findOne({ year, dept, roll });
    if (!student) {
      return res.status(404).json({ error: "❌ Student not found" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "❌ No file uploaded" });
    }

    // console.log("Cloudinary Upload Response:", req.file);

    // ✅ Cloudinary public_id (marksheets/xxxxx)
    student.marksheet = req.file.filename; 
    await student.save();

    res.json({
      message: "✅ Marksheet uploaded successfully",
      marksheetId: req.file.filename,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// Student download marksheet
router.get("/get-marksheet", async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user.role !== "student") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const student = await Student.findById(req.user.student._id);

    if (!student || !student.marksheet) {
      return res.status(404).json({ error: "❌ Marksheet not available" });
    }

    // console.log("Student marksheet public_id:", student.marksheet);

    // ✅ Correct: use .url() with sign_url: true
    const signedUrl = cloudinary.url(student.marksheet, {
      resource_type: "raw",
      type: "authenticated",
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + 3600, // 1h expiry
    });

    res.json({ url: signedUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
