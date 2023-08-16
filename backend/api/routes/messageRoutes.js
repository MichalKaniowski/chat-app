const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const {
  createMessage,
  getMessages,
  deleteMessage,
} = require("../controllers/messageController");

router.post("/", checkAuth, createMessage);
router.get("/", checkAuth, getMessages);
router.delete("/", checkAuth, deleteMessage);

module.exports = router;
