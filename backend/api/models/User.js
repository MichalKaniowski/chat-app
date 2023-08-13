const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    active: { type: Boolean, default: true },
    image: { type: String, default: "" },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    refreshToken: { type: String, default: "" },

    conversationIds: [{ type: mongoose.Types.ObjectId, ref: "Conversation" }],
    seenMessageIds: [{ type: mongoose.Types.ObjectId, ref: "Message" }],
    sentMessageIds: [{ type: mongoose.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
