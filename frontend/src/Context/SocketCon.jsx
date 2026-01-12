import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./Authcontext";

const SocketCon = createContext();

export const useSocketContext = () => {
  return useContext(SocketCon);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    if (authUser) {
      const socket = io("https://convo-chat-backend.vercel.app", {
        withCredentials: true,
        transports: ["websocket"],
        query: { userId: authUser?._id },
      });

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      setSocket(socket);

      return () => socket.close();
    } else if (socket) {
      socket.close();
      setSocket(null);
    }
  }, [authUser]);

  return (
    <SocketCon.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketCon.Provider>
  );
};
