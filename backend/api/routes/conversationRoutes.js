const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const {
  getConversations,
  createConversation,
  getConversation,
  updateSeenInConversation,
} = require("../controllers/conversationController");

router.get("/", checkAuth, getConversations);

router.post("/", checkAuth, createConversation);

router.get("/:conversationId", checkAuth, getConversation);

router.post("/:conversationId/seen", checkAuth, updateSeenInConversation);

module.exports = router;
