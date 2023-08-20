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

    const populatedConversations = [];

    for (const conversation of conversations) {
      const populatedConversation = await conversation.populate("userIds");
      populatedConversations.push(populatedConversation);
    }

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
    const { id: targetUserId, name } = req.body;

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
      const populatedExistingConversation = await existingConversation.populate(
        [
          { path: "userIds", select: "-password" },
          { path: "messageIds", populate: { path: "authorId" } },
        ]
      );

      return res.status(200).json(populatedExistingConversation);
    }

    let conversation = await Conversation.create({
      name: name ? name : "",
      userIds: [requestUserId, targetUserId],
    });

    conversation = await conversation.populate([
      { path: "userIds", select: "-password" },
      { path: "messageIds", populate: { path: "authorId" } },
    ]);

    res.status(201).json(conversation);
  } catch (error) {
    res.status(400).json({ message: "Invalid data" });
  }
}

async function getConversation(req, res) {
  try {
    const conversationId = req.params.conversationId;
    const conversation = await Conversation.findOne({
      _id: conversationId,
    }).populate([
      { path: "userIds", select: "-password" },
      { path: "messageIds", populate: { path: "authorId" } },
    ]);

    res.status(200).json(conversation);
  } catch (error) {
    res.status(400).json({ message: "Invalid conversationId" });
  }
}

module.exports = { getConversations, createConversation, getConversation };
