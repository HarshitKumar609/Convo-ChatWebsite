import Conversation from "../../Module/ConversationModule.js";
import Message from "../../Module/messagemodule.js";
import { getReceiverSocketIds, io } from "../../Soket/Soket.js";

/* ================= SEND MESSAGE ================= */
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params; // ✅ use lowercase receiverId
    const senderId = req.user._id;

    // Find existing conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // Create if not exists
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create new message
    const newMessage = await Message.create({
      senderId,
      ReceiverId: receiverId, // ✅ matches your schema
      message,
      conversationId: conversation._id,
    });

    // Add message to conversation
    conversation.messages.push(newMessage._id);
    await conversation.save();

    // Emit via socket
    const receiverSocketIds = getReceiverSocketIds(receiverId);

    if (receiverSocketIds.length > 0) {
      receiverSocketIds.forEach((socketId) => {
        io.to(socketId).emit("newMessage", {
          message: newMessage,
          conversationId: conversation._id.toString(),
        });
      });
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET MESSAGES ================= */
export const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params; // ✅ lowercase for consistency
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
