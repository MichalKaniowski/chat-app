const mongoose = require("mongoose");
const User = require("./User");
const Conversation = require("./Conversation");

const messageSchema = mongoose.Schema(
  {
    body: { type: String, required: true },
    image: { type: String, required: true },
    authorId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    conversationId: {
      type: mongoose.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    seenIds: [{ type: mongoose.Types.ObjectId, ref: "User", default: [] }],
  },
  { timestamps: true }
);

messageSchema.post("save", async (doc, next) => {
  try {
    // add messageId to user's sentMessageIds and seenMessageids
    // add messageId to conversation's messageIds
    await User.findOneAndUpdate(
      { _id: doc.authorId },
      { $addToSet: { sentMessageIds: doc._id, seenMessageIds: doc._id } }
    );

    await Conversation.findOneAndUpdate(
      { _id: doc.conversationId },
      { $addToSet: { messageIds: doc._id } }
    );
    next();
  } catch (error) {
    console.error(
      "Error while updating users and conversation when creating message."
    );
  }
});

messageSchema.post("findOneAndDelete", async (doc, next) => {
  // delete messageId from user's sentMessageIds and from all users which had it in seenMessageIds
  // delete it's id from conversation's messageIds
  try {
    await Conversation.findOneAndUpdate(
      { _id: doc.conversationId },
      { $pull: { messageIds: doc._id } }
    );

    await User.findOneAndUpdate(
      { _id: doc.authorId },
      { $pull: { sentMessageIds: doc._id } }
    );

    await User.updateMany(
      { seenMessageIds: doc._id },
      { $pull: { seenMessageIds: doc._id } }
    );
  } catch (error) {
    console.error(
      "Error while updating users and conversation when deleting message."
    );
  }
});

module.exports = mongoose.model("Message", messageSchema);
