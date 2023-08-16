const mongoose = require("mongoose");
const User = require("./User");

const conversationSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    lastMessageAt: { type: Date },
    isGroup: { type: Boolean, default: false },

    userIds: [{ type: mongoose.Types.ObjectId, ref: "User", required: true }],
    messageIds: [
      { type: mongoose.Types.ObjectId, ref: "Message", default: [] },
    ],
  },
  { timestamps: true }
);

conversationSchema.post("save", async (doc) => {
  try {
    // once conversation is created every user which belongs to that conversation, will have it's conversationIds updated
    await User.updateMany(
      { _id: { $in: doc.userIds } },
      { $addToSet: { conversationIds: doc._id } }
    );
  } catch (error) {
    console.error("Error updating conversationIds for users:", error);
  }
});

module.exports = mongoose.model("Conversation", conversationSchema);
