import mongoose from "mongoose";
import Conversation from "./ConversationModule.js";

const messageschema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ReceiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      default: [],
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageschema);

export default Message;
