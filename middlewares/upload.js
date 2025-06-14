const multer = require("multer");
const path = require("path");

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/reports"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    // Optional: Keep original name with timestamp to avoid overwriting
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/\s+/g, "_"); // Replace spaces with underscores
    cb(null, `${timestamp}_${originalName}`);
  },
});

// Allow only PDF, PNG, JPG, and JPEG
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const isValidExt = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isValidMime = allowedTypes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, JPEG, and PNG files are allowed"));
  }
};

// Set upload rules
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
});

module.exports = upload;
