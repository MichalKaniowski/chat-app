const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const userInDatabase = await User.findOne({ email });

    if (userInDatabase) {
      return res
        .status(400)
        .json({ message: "This email address is already taken." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username: "username",
      email,
      password: hashedPassword,
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid data." });
    }

    const token = jwt.sign(
      { email, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Succesfully signed up.", token });
  } catch (error) {
    res.status(400).json({ message: "Invalid data." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "There is no user with this email address." });
    }

    const arePasswordsTheSame = await bcrypt.compare(password, user.password);

    if (!arePasswordsTheSame) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const token = jwt.sign(
      { id: user._id, email: email, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Logged in succesfully.", token });
  } catch (error) {
    res.status(401).json({ message: "Invalid data" });
  }
});

router.get("/", async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json(users);
});

module.exports = router;
