const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

async function createMessage(req, res) {
  try {
    const { body, image, authorId, conversationId } = req.body;

    if ((!body && !image) || !authorId || !conversationId) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const message = await Message.create({
      body,
      image,
      authorId,
      conversationId,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: "Invalid data" });
  }
}

async function getMessages(req, res) {
  try {
    const { conversationId } = req.body;

    const conversation = await Conversation.findOne({
      _id: conversationId,
    }).populate("messageIds");
    const messages = await conversation.messageIds;

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: "Invalid data" });
  }
}

async function deleteMessage(req, res) {
  try {
    const { messageId } = req.body;

    if (!messageId) {
      return res.status(400).json({ message: "MessageId is required." });
    }

    const deletedMessage = await Message.findOneAndDelete({ _id: messageId });

    if (!deletedMessage) {
      return res
        .status(400)
        .json({ message: "Message with this id doesn't exist." });
    }

    res.status(200).json({
      message: "Succesfully removed the message",
      deletedMessage: deletedMessage,
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid data" });
  }
}

module.exports = { createMessage, getMessages, deleteMessage };
