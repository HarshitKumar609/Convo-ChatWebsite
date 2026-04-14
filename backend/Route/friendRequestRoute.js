import express from "express";
import isLogin from "../Middleware/isLogin.js";
import {
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  rejectFriendRequest,
} from "./routecontroller/friendController.js";

const router = express.Router();

router.post("/send", isLogin, sendFriendRequest);
router.post("/accept/:requestId", isLogin, acceptFriendRequest);
router.post("/reject/:requestId", isLogin, rejectFriendRequest);
router.get("/requests", isLogin, getFriendRequests);

export default router;
