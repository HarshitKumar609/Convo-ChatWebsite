import Conversation from "../../Module/ConversationModule.js";
import User from "../../Module/userModule.js";

export const getuserbysearch = async (req, res) => {
  try {
    const search = req.query.search?.trim();
    const currentId = req.user._id;

    // ❗ If empty search → return chat list
    if (!search) {
      return res.status(200).send([]);
    }

    // 1️⃣ Get all conversations of current user
    const conversations = await Conversation.find({
      participants: currentId,
    });

    // 2️⃣ Extract other participants (friends)
    let friendIds = conversations.flatMap((conv) =>
      conv.participants.filter((id) => id.toString() !== currentId.toString()),
    );

    // 3️⃣ Remove duplicates
    friendIds = [...new Set(friendIds.map((id) => id.toString()))];

    // 4️⃣ Find only those friends + apply search
    const users = await User.find({
      _id: { $in: friendIds },
      $or: [
        { username: { $regex: search, $options: "i" } },
        { fullname: { $regex: search, $options: "i" } },
      ],
    }).select("fullname username profilepic");

    res.status(200).send(users);
  } catch (error) {
    console.log("SEARCH ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//currentchatters
export const getcurrentchatters = async (req, res) => {
  try {
    const currentId = req.user._id;
    const currentchatters = await Conversation.find({
      participants: currentId,
    }).sort({ updatedAt: -1 });

    if (!currentchatters || currentchatters.length === 0)
      return res.status(200).send([]);

    const participantsIDS = currentchatters.reduce((ids, conversation) => {
      const otherparticipents = conversation.participants.filter(
        (id) => id !== currentId,
      );

      return [...ids, ...otherparticipents];
    }, []);

    const otherparticipentsIDS = participantsIDS.filter(
      (id) => id.toString() !== currentId.toString(),
    );

    const user = await User.find({ _id: { $in: otherparticipentsIDS } })
      .select("-password")
      .select("-email");
    const users = otherparticipentsIDS.map((id) =>
      user.find((user) => user._id.toString() === id.toString()),
    );

    res.status(200).send(users);
  } catch (error) {
    console.log("SEARCH ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
