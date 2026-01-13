import User from "../../Module/userModule.js";
import jsontoken from "../../utils/jwttoken.js";

import bcryptjs from "bcryptjs";

export const userRegister = async (req, res) => {
  try {
    const { fullname, username, email, gender, password, profilepic } =
      req.body;
    const user = await User.findOne({ username, email });

    if (user)
      return res
        .status(409)
        .send({ success: false, message: "username and email already exists" });
    const hashpassword = bcryptjs.hashSync(password, 10);
    const profileboy =
      profilepic ||
      `https://img.favpng.com/8/9/5/vector-graphics-clip-art-avatar-computer-icons-image-png-favpng-maGsu9iBZTCk9dTVfC8FyHqDe.jpg`;
    const profilegirl =
      profilepic ||
      `https://img.pikbest.com/png-images/20250215/-pretty-girl-person-avatar-logo-vector-woman-head-icon-filled-line-style-vector_11527877.png!sw800`;

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashpassword,
      gender,
      profilepic: gender === "male" ? profileboy : profilegirl,
    });

    if (newUser) {
      await newUser.save();
      jsontoken(newUser._id, res);
    } else {
      res.status(500).send({ success: false, message: "Invalid user Data" });
    }

    res.status(201).send({
      _id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      email: newUser.email,
      profilepic: newUser.profilepic,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
    console.log(error);
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(500).send({
        success: false,
        message: "Email Does'not Exists Register Please",
      });
    const comparepassword = bcryptjs.compareSync(password, user.password || "");
    if (!comparepassword)
      return res.status(500).send({
        success: false,
        message: "Email or Password Not Match",
      });
    jsontoken(user._id, res);
    res.status(201).send({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      profilepic: user.profilepic,
      message: "Successfully Login",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
    console.log(error);
  }
};

export const userLogOut = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 0,
    });
    res.status(200).send({ message: "logout successfully" });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
    console.log(error);
  }
};
