const express = require("express");
const passport = require("passport");

const Student = require("../models/student");
const Teacher = require("../models/teacher");

const router = express.Router();

// Register route (same as before)
router.post("/signup", async (req, res) => {
  try {
    const { role, name, year, dept, roll, dob, gmail, teacherId } = req.body;
    if (role === "student") {
      const student = new Student({ name, year, dept, roll, dob });
      await student.save();
      return res.json({ message: "✅ Student registered successfully" });
    } else if (role === "teacher") {
      const teacher = new Teacher({ name, gmail, teacherId });
      await teacher.save();
      return res.json({ message: "✅ Teacher registered successfully" });
    } else {
      return res.status(400).json({ error: "❌ Invalid role" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Server error" });
  }
});

// Student Login
router.post("/login/student", (req, res, next) => {
  passport.authenticate("student-local", async (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info.message });

    req.logIn(user, async (err) => {
      if (err) return next(err);

      // 🔹 Fetch full student doc
      const student = await Student.findById(user.id);
      return res.json({
        message: "✅ Student logged in successfully",
        user: { role: "student", student },
      });
    });
  })(req, res, next);
});

// Teacher Login
router.post("/login/teacher", (req, res, next) => {
  passport.authenticate("teacher-local", async (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info.message });

    req.logIn(user, async (err) => {
      if (err) return next(err);

      const teacher = await Teacher.findById(user.id);
      return res.json({
        message: "✅ Teacher logged in successfully",
        user: { role: "teacher", teacher },
      });
    });
  })(req, res, next);
});





// Logout
router.post("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "✅ Logged out successfully" });
  });
});

// Protected route example
router.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.json({ user: req.user }); // ✅ { role, student/teacher }
});

router.get("/", (req, res) => {
  res.send("Backend running successfully .........")
});



module.exports = router;
