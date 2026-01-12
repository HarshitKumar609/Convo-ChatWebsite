import express from "express";
import dotenv from "dotenv";
import connectTODatabae from "./Db/db.js";
import authRouter from "./Route/AuthUser.js";
import messageRouter from "./Route/messageroute.js";
import userRoute from "./Route/userRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./Soket/Soket.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// ================= MIDDLEWARES =================

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
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

// ================= START SERVER =================
const startServer = async () => {
  try {
    await connectTODatabae();
    console.log("✅ Database connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
