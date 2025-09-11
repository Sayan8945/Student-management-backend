const LocalStrategy = require("passport-local").Strategy;
const Student = require("../models/student");
const Teacher = require("../models/teacher");

module.exports = function (passport) {
  // Student Strategy
  passport.use(
    "student-local",
    new LocalStrategy(
      { usernameField: "roll", passwordField: "dob", passReqToCallback: true },
      async (req, roll, dob, done) => {
        try {
          const student = await Student.findOne({
            roll,
            dept: req.body.dept,
            year: req.body.year,
            dob: new Date(dob),
          });
          if (!student) return done(null, false, { message: "Invalid Student Credentials" });
          return done(null, { role: "student", id: student._id });
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Teacher Strategy
  passport.use(
    "teacher-local",
    new LocalStrategy(
      { usernameField: "gmail", passwordField: "teacherId" },
      async (gmail, teacherId, done) => {
        try {
          const teacher = await Teacher.findOne({ gmail, teacherId });
          if (!teacher) return done(null, false, { message: "Invalid Teacher Credentials" });
          return done(null, { role: "teacher", id: teacher._id });
        } catch (err) {
          return done(err);
        }
      }
    )
  );


  // Session serialize
  passport.serializeUser((user, done) => {
    done(null, { id: user.id, role: user.role });
  });

  passport.deserializeUser(async (user, done) => {
  try {
    if (user.role === "student") {
      const student = await Student.findById(user.id);
      done(null, { role: "student", student }); // ✅ send full student doc
    } else if (user.role === "teacher") {
      const teacher = await Teacher.findById(user.id);
      done(null, { role: "teacher", teacher }); // ✅ send full teacher doc
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err);
  }
});

};
