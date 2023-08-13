const Conversation = require("../models/Conversation");
const User = require("../models/User");

async function getConversations(req, res) {
  try {
    const token = await req?.token;
    const userData = await req.userData;
    const email = userData?.email;

    const user = await User.findOne({ email })
      .populate("conversationIds")
      .select("-password");
    const conversations = await user?.conversationIds;

    if (!conversations) {
      return res.status(500).json({ message: "Internal server error." });
    }

    res.status(200).json({ conversations, token });
  } catch (error) {
    res.status(400).json({ message: "Invalid data" });
  }
}

async function createConversation(req, res) {
  try {
    const { id: targetUserId } = req.body;

    const requestUserId = req.userData.id;
    if (!requestUserId || !targetUserId) {
      return res.status(400).json({ message: "Incorrect or missing data." });
    }

    const conversations = await Conversation.find();
    const requestUserConversations = conversations.filter(
      (conversation) =>
        conversation.userIds.includes(requestUserId) &&
        conversation.isGroup === false
    );

    const existingConversation = requestUserConversations.find((conversation) =>
      conversation.userIds.includes(targetUserId)
    );

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    const conversation = await Conversation.create({
      name: "test name of conversation",
      userIds: [requestUserId, targetUserId],
    });

    res.status(201).json(conversation);
  } catch (error) {
    res.status(400).json({ message: "Invalid data" });
  }
}

module.exports = { getConversations, createConversation };
