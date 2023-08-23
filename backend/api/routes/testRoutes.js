const express = require("express");
const router = express.Router();
const Test = require("../models/Test");
const fs = require("fs");

router.post("/", async (req, res) => {
  const image = req.body.image;

  const result = await Test.create({ image });

  return res.status(200).json(result);
});

router.get("/", async (req, res) => {
  const id = req.body.id;

  const result = await Test.findOne({ _id: id });
  const decodedImage = await Buffer.from(result.image, "base64");
  fs.writeFileSync("output.png", decodedImage);

  return res.status(200).json(result);
});

module.exports = router;
