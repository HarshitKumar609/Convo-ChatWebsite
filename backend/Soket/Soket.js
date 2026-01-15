import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

// userId => Set of socketIds
const userSocketmap = {};

export const getReceiverSocketIds = (receiverId) => {
  return userSocketmap[receiverId] ? Array.from(userSocketmap[receiverId]) : [];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    socket.userId = userId;

    if (!userSocketmap[userId]) {
      userSocketmap[userId] = new Set();
    }

    userSocketmap[userId].add(socket.id);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketmap));

  socket.on("disconnect", () => {
    if (socket.userId) {
      userSocketmap[socket.userId]?.delete(socket.id);

      if (userSocketmap[socket.userId]?.size === 0) {
        delete userSocketmap[socket.userId];
      }
    }

    io.emit("getOnlineUsers", Object.keys(userSocketmap));
  });
});

export { app, io, server };
