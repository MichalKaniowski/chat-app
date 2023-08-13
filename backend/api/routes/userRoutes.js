const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json(users);
});

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
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // we manually control expiration of refresh token
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_REFRESH_KEY
    );

    user.refreshToken = refreshToken;
    await user.save();

    res
      .status(200)
      .json({ message: "Succesfully signed up.", token, refreshToken });
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
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // we manually control expiration of refresh token
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_REFRESH_KEY
    );

    user.refreshToken = refreshToken;
    await user.save();

    res
      .status(200)
      .json({ message: "Logged in succesfully.", token, refreshToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid data" });
  }
});

router.post("/token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required." });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
    const email = decoded.email;
    const userInDatabase = await User.findOne({ email });

    if (userInDatabase.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token." });
    }

    const token = jwt.sign(
      {
        id: userInDatabase._id,
        email: userInDatabase.email,
        role: userInDatabase.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(201).json(token);
  } catch (error) {
    res.status(401).json("Invalid or no token.");
  }
});

router.delete("/logout", async (req, res) => {
  try {
    const refreshToken = req.query.refreshToken;

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);

    const user = await User.findOne({ email: decoded.email });
    user.refreshToken = "";
    await user.save();
    res.status(203).json({ message: "Succesfully deleted refresh token" });
  } catch {
    res.status(401).json({ message: "Invalid refresh token." });
  }
});

module.exports = router;
