const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "marksheets",
    resource_type: "raw",
    type: "authenticated", // ✅ ensures file is stored as authenticated
    format: "pdf",
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("❌ Only PDF files are allowed"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
