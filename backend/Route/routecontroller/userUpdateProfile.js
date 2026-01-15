import User from "../../Module/userModule.js";
import bcryptjs from "bcryptjs";
import { uploadOnCloudinary } from "../../utils/Cloudinary.js";

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const { fullname, username, email, gender, password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // 🔹 Update text fields
    if (fullname) user.fullname = fullname;
    if (username) user.username = username;
    if (email) user.email = email;
    if (gender) user.gender = gender;

    // 🔹 Update password
    if (password) {
      const hashedPassword = bcryptjs.hashSync(password, 10);
      user.password = hashedPassword;
    }

    // 🔹 Update profile picture (Cloudinary)
    if (req.file?.path) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
      if (cloudinaryResponse?.url) {
        user.profilepic = cloudinaryResponse.url;
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        gender: user.gender,
        profilepic: user.profilepic,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
};
