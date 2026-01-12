import jwt from "jsonwebtoken";
import User from "../Module/userModule.js";

const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    // console.log(token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode)
      return res
        .status(500)
        .send({ success: false, message: "user unauthorized -Invalid Token" });

    const user = await User.findById(decode.userId).select("-password");
    if (!user)
      return res
        .status(500)
        .send({ success: false, message: "user not found" });
    req.user = user;
    next();
  } catch (error) {
    console.log(`Error in isLogin middleware ${error.message}`);
    res.status(500).send({ success: false, message: error });
  }
};

export default isLogin;
