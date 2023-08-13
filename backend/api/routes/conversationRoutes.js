const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const {
  getConversations,
  createConversation,
} = require("../controllers/conversationController");

router.get("/", checkAuth, getConversations);

router.post("/", checkAuth, createConversation);

module.exports = router;
