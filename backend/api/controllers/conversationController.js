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
      const populatedConversation = await conversation.populate(
        "userIds messageIds"
      );
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
    console.log(0);
    const { id: targetUserId, name } = req.body;

    console.log(1);

    const requestUserId = req.userData.id;
    if (!requestUserId || !targetUserId) {
      return res.status(400).json({ message: "Incorrect or missing data." });
    }

    console.log(2);

    const conversations = await Conversation.find();
    const requestUserConversations = conversations.filter(
      (conversation) =>
        conversation.userIds.includes(requestUserId) &&
        conversation.isGroup === false
    );

    console.log(3);

    const existingConversation = requestUserConversations.find((conversation) =>
      conversation.userIds.includes(targetUserId)
    );

    console.log(4);

    if (existingConversation) {
      const populatedExistingConversation = await existingConversation.populate(
        [
          { path: "userIds", select: "-password" },
          { path: "messageIds", populate: { path: "authorId" } },
        ]
      );

      return res.status(200).json(populatedExistingConversation);
    }

    console.log(5);
    console.log("here");

    let conversation = await Conversation.create({
      name: name || "",
      userIds: [requestUserId, targetUserId],
    });

    console.log(6);

    conversation = await conversation.populate([
      { path: "userIds", select: "-password" },
      { path: "messageIds", populate: { path: "authorId" } },
    ]);
    console.log(7);

    res.status(201).json(conversation);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid data" });
  }
}

async function getConversation(req, res) {
  try {
    console.log("we're in getconversation");
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

async function updateSeenInConversation(req, res) {
  try {
    const { id: userId } = req?.userData;
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({ message: "ConversationId is required." });
    }

    const conversation = await Conversation.findOne({ _id: conversationId });
    const user = await User.findOne({ _id: userId });

    const messageIds = conversation.messageIds;
    const messageIdsToAdd = [];

    for (const messageId of messageIds) {
      if (!user.seenMessageIds.includes(messageId)) {
        messageIdsToAdd.push(messageId);
      }
    }

    user.seenMessageIds = [...user.seenMessageIds, ...messageIdsToAdd];
    await user.save();

    res
      .status(200)
      .json({ message: "Succesfully updated seenMessageIds in user model." });
  } catch (error) {
    console.log(2);
    res.status(400).json({ message: "Invalid conversation id" });
  }
}

module.exports = {
  getConversations,
  createConversation,
  getConversation,
  updateSeenInConversation,
};
