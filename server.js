const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
require("./config/passport")(passport);
require("dotenv").config();


const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors({
  // origin: "https://student-management-frontend-taupe.vercel.app", // your React app URL
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(bodyParser.json());

// Session setup
app.use(
  session({
    secret: "supersecretkey", // change in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set true if using https
  })
);

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", authRoutes);
app.get("/debug", (req, res) => {
  res.json({ session: req.session, user: req.user });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
