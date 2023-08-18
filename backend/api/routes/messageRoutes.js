const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const {
  createMessage,
  deleteMessage,
} = require("../controllers/messageController");

router.post("/", checkAuth, createMessage);
router.delete("/", checkAuth, deleteMessage);

module.exports = router;
