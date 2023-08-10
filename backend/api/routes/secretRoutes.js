const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

router.get("/", checkAuth, async (req, res) => {
  const userData = req.userData;

  res
    .status(200)
    .json({ message: "Here is secret: fhsa8trer823r", user: userData });
});

module.exports = router;
