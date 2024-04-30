const express = require("express");
const router = express.Router();

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const uuid = require("uuid").v4;

const normalizeFilename = (filename) => {
  // we normalize filenames so when url is constructed we dont get different urls from that we have saved in our database
  filename = filename.replace(/[^\w\s.-]/g, "");
  filename = filename.replace(/\s+/g, "_");
  filename = filename.toLowerCase();

  return filename;
};

const s3Uploadv3 = async (files) => {
  const credentials = {
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
  };
  const s3client = new S3Client(credentials);

  const fileUrls = [];

  const responses = await Promise.all(
    files.map(async (file) => {
      const key = normalizeFilename(`${uuid()}-${file.originalname}`);
      const modifiedFile = {
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: file.buffer,
      };

      try {
        const res = await s3client.send(new PutObjectCommand(modifiedFile));

        if (res.$metadata.httpStatusCode === 200) {
          const filename =
            "https://my-messenger1.s3.eu-central-1.amazonaws.com/" + key;
          fileUrls.push(filename);
          return res;
        }
      } catch (error) {}
    })
  );

  return { responses, fileUrls: fileUrls };
};

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

router.post("/upload", upload.array("file"), async (req, res) => {
  try {
    const results = await s3Uploadv3(req.files);
    console.log("RESULTS: ", results);
  } catch (error) {
    console.log("error occured: ", error);
  }
});

module.exports = router;
