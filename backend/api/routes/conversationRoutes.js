const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const {
  getConversations,
  createConversation,
  getConversation,
  getLastConversationForUser,
  updateSeenInConversation,
} = require("../controllers/conversationController");

router.get("/", checkAuth, getConversations);

router.post("/", checkAuth, createConversation);

router.get(
  "/getLastConversationForUser",
  checkAuth,
  getLastConversationForUser
);

router.get("/conversation/:conversationId", checkAuth, getConversation);

router.post(
  "/conversation/:conversationId/seen",
  checkAuth,
  updateSeenInConversation
);

module.exports = router;
