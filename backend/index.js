import express from "express";
import dotenv from "dotenv";
import connectTODatabae from "./Db/db.js";
import authRouter from "./Route/AuthUser.js";
import messageRouter from "./Route/messageroute.js";
import userRoute from "./Route/userRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./Soket/socket.js";

// Load env only locally
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Connect DB (important: no await wrapper)
connectTODatabae();

// ================= MIDDLEWARES =================
app.use(express.json());

app.use(
  cors({
    origin: "https://convo-wheat.vercel.app",
    credentials: true,
  })
);

app.use(cookieParser());

// ================= ROUTES =================
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/user", userRoute);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.status(200).send("Chat App Backend Running 🚀");
});

export default server;
