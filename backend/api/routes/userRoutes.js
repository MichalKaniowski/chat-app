const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  loginUser,
  createAccessToken,
  logoutUser,
} = require("../controllers/userController");

router.get("/", getUsers);

router.post("/signup", createUser);

router.post("/login", loginUser);

router.post("/token", createAccessToken);

router.delete("/logout", logoutUser);

module.exports = router;
