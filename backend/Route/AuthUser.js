import express from "express";
import isLogin from "../Middleware/isLogin.js";
import {
  userLogin,
  userLogOut,
  userRegister,
} from "./routecontroller/userroutecontroller.js";
import { updateUserProfile } from "./routecontroller/userUpdateProfile.js";
import { upload } from "../Middleware/multer.middlewares.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/logout", userLogOut);
router.put(
  "/update-profile",
  isLogin,
  upload.single("profilepic"),
  updateUserProfile
);
export default router;
