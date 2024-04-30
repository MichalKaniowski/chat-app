const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const {
  createMessage,
  deleteMessage,
} = require("../controllers/messageController");

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
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

// router.post("/upload", upload.array("file"), async (req, res) => {
//   try {
//     const results = await s3Uploadv3(req.files);
//     console.log("RESULTS: ", results);
//   } catch (error) {
//     console.log("error occured: ", error);
//   }
// });

router.post("/", checkAuth, upload.array("file"), createMessage);
// router.post("/", checkAuth, createMessage);
router.delete("/", checkAuth, deleteMessage);

module.exports = router;
