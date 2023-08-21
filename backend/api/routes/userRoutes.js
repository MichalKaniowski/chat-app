const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const {
  getUsers,
  createUser,
  loginUser,
  createAccessToken,
  logoutUser,
} = require("../controllers/userController");

router.get("/", checkAuth, getUsers);

router.post("/signup", createUser);

router.post("/login", loginUser);

router.post("/token", createAccessToken);

router.delete("/logout", logoutUser);

module.exports = router;
