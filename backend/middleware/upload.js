const multer = require("multer");
const fs = require("fs");

const uploadDir = "uploads/avatars/";

// Create the directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
});


const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB for image size
});

module.exports = upload;