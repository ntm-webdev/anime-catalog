const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
    req.fileValidationError = "Forbidden extension";
    return callback(null, false, req.fileValidationError);
  }
  callback(null, true);
};

const limits = {
  fileSize: 1024 * 1024 * 5
};

module.exports = { multer, storage, fileFilter, limits };
