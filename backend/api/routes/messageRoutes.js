const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const {
  uploadFileMessage,
  deleteMessage,
} = require("../controllers/messageController");

const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype.split("/")[0];
  if (fileType === "image" || fileType === "video") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024, files: 5 }, //25mb
});

router.post("/upload/", checkAuth, upload.array("file"), uploadFileMessage);
router.delete("/", checkAuth, deleteMessage);

module.exports = router;
