const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    email,
    password: hashedPassword,
    // role: role || "USER",
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid data." });
  }

  res.status(200).json({ message: "Succesfully signed up." });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Incorrect email." });
  }

  const arePasswordsTheSame = await bcrypt.compare(password, user.password);

  if (!arePasswordsTheSame) {
    return res.status(400).json({ message: "Incorrect password." });
  }

  const token = jwt.sign(
    { email, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );

  const decodedToken = jwt_decode(token);

  res.status(200).json({ message: "Logged in succesfully.", token });
});

module.exports = router;
