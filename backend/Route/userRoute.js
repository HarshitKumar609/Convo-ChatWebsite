import express from "express";
import isLogin from "../Middleware/isLogin.js";
import {
  getcurrentchatters,
  getuserbysearch,
} from "./routecontroller/usersearchcontroller.js";

const router = express.Router();

router.get("/search", isLogin, getuserbysearch);
router.get("/currentchatter", isLogin, getcurrentchatters);

export default router;
