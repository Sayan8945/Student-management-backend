const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const marksheetRoutes = require("./routes/marksheet");
require("./config/passport")(passport);
require("dotenv").config();


const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors({
  origin: "https://student-management-frontend-taupe.vercel.app",
  credentials: true
}));
app.use(bodyParser.json());

const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // reduce session writes
});

store.on("error", (err) => {
  console.error("❌ Error in mongo session store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,                                // cookie not accessible via JS
    secure: process.env.NODE_ENV === "production", // true on Vercel, false locally
    sameSite: "none",                              // ✅ required for cross-domain
    maxAge: 1000 * 60 * 60 * 24,                   // 1 day
  },
};

app.use(session(sessionOptions));


// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", authRoutes);
app.get("/debug", (req, res) => {
  res.json({ session: req.session, user: req.user });
});
app.use("/uploads", express.static("uploads"));
app.use("/", marksheetRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});