import FriendRequest from "../../Module/FriendRequest.js";
import Conversation from "../../Module/ConversationModule.js";

/* ================= SEND REQUEST ================= */
export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.body;

    // ❌ Prevent sending to self
    if (senderId.toString() === receiverId) {
      return res
        .status(400)
        .json({ message: "Cannot send request to yourself" });
    }

    // 🔥 Check both directions (IMPORTANT)
    const existing = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existing) {
      return res.status(400).json({ message: "Request already exists" });
    }

    const request = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
    });

    res.status(201).json(request);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= ACCEPT REQUEST ================= */
export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // 🔒 Only receiver can accept
    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ❌ Already accepted
    if (request.status === "accepted") {
      return res.status(400).json({ message: "Already accepted" });
    }

    // ✅ Accept request
    request.status = "accepted";
    await request.save();

    // 🔥 Create conversation ONLY if not exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: [request.sender, request.receiver] },
    });

    if (!existingConversation) {
      await Conversation.create({
        participants: [request.sender, request.receiver],
      });
    }

    res.status(200).json({ message: "Request accepted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET REQUESTS ================= */
export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await FriendRequest.find({
      receiver: userId,
      status: "pending",
    }).populate("sender", "username profilepic");

    res.status(200).json(requests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= REJECT REQUEST (BONUS) ================= */
export const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "rejected";
    await request.save();

    res.status(200).json({ message: "Request rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
