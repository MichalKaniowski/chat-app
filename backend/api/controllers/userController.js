const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

async function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );
}

async function generateRefreshToken(user) {
  // expiration time is not set, because we control expiration of refresh token
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_REFRESH_KEY
  );
}

async function getUsers(req, res) {
  const users = await User.find().select("-password");

  res.status(200).json(users);
}

async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!email || !password || !username) {
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
      username,
      email,
      password: hashedPassword,
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid data." });
    }

    const token = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res
      .status(200)
      .json({ message: "Succesfully signed up.", token, refreshToken });
  } catch (error) {
    res.status(400).json({ message: "Invalid data." });
  }
}

async function loginUser(req, res) {
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

    const token = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res
      .status(200)
      .json({ message: "Logged in succesfully.", token, refreshToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid data" });
  }
}

async function createAccessToken(req, res) {
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
}

async function logoutUser(req, res) {
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
}

module.exports = {
  getUsers,
  createUser,
  loginUser,
  createAccessToken,
  logoutUser,
};
