import Conversation from "../../Module/ConversationModule.js";
import User from "../../Module/userModule.js";

export const getuserbysearch = async (req, res) => {
  try {
    const search = req.query.search || "";
    const currentId = req.user._id;

    const user = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: ".*" + search + ".*", $options: "i" } },
            { fullname: { $regex: ".*" + search + ".*", $options: "i" } },
          ],
        },
        {
          _id: { $ne: currentId },
        },
      ],
    })
      .select("-password")
      .select("email");

    res.status(200).send(user);
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
        (id) => id !== currentId
      );

      return [...ids, ...otherparticipents];
    }, []);

    const otherparticipentsIDS = participantsIDS.filter(
      (id) => id.toString() !== currentId.toString()
    );

    const user = await User.find({ _id: { $in: otherparticipentsIDS } })
      .select("-password")
      .select("-email");
    const users = otherparticipentsIDS.map((id) =>
      user.find((user) => user._id.toString() === id.toString())
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
