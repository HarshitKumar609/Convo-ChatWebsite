import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/Authcontext";
import { useNavigate } from "react-router-dom";
import userConversation from "../../zustand/UserConversation";
import { useSocketContext } from "../../Context/SocketCon";

const SideBar = ({ onSelectUser }) => {
  const { authUser, setauthUser } = useAuth();
  const navigate = useNavigate();
  const { setSelectedConversation, selectedConversation } = userConversation();
  const { socket } = useSocketContext();

  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [unreadCounts, setUnreadCounts] = useState({});

  /* ================= FETCH CHAT USERS ================= */
  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:3000/api/user/currentchatter",
          { withCredentials: true }
        );
        setChatUser(res.data || []);
      } catch {
        toast.error("Failed to load chat users");
      } finally {
        setLoading(false);
      }
    };

    fetchChatUsers();
  }, []);

  /* ================= SOCKET (UNREAD LOGIC) ================= */
  useEffect(() => {
    if (!socket || !authUser?._id) return;

    const handleNewMessage = ({ message }) => {
      // ignore own messages
      if (message.senderId === authUser._id) return;

      // if chat is open, don't count unread
      if (selectedConversation?._id === message.senderId) return;

      setUnreadCounts((prev) => ({
        ...prev,
        [message.senderId]: (prev[message.senderId] || 0) + 1,
      }));
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, authUser?._id, selectedConversation?._id]);

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setSearchUser([]);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:3000/api/user/search?search=${searchInput}`,
        { withCredentials: true }
      );

      setSearchUser(res.data || []);
    } catch (error) {
      toast.error("User search failed");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!searchInput.trim()) {
      setSearchUser([]);
    }
  }, [searchInput]);

  /* ================= USER CLICK ================= */
  const handleUserClick = (user) => {
    setSelectedConversation(user);
    setSelectedUserId(user._id);
    onSelectUser(user);

    setUnreadCounts((prev) => {
      const copy = { ...prev };
      delete copy[user._id];
      return copy;
    });
  };

  const usersToShow = searchUser.length ? searchUser : chatUser;

  return (
    <div className="h-full w-full flex flex-col px-3 py-4 gap-4 bg-white/5">
      {/* ================= SEARCH + PROFILE ================= */}
      <div className="flex items-center gap-3">
        <form
          className="relative flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search users..."
            className="w-full h-11 pl-5 pr-14 rounded-full bg-black/30 text-white"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bg-sky-500 p-2 rounded-full"
          >
            <IoSearchSharp />
          </button>
        </form>

        {/* ✅ PROFILE ICON RESTORED */}
        <img
          src={authUser?.profilepic || "/avatar.png"}
          alt="profile"
          onClick={() => navigate("/dashboard")}
          className="w-11 h-11 rounded-full object-cover cursor-pointer border border-white/20"
        />
      </div>

      {/* ================= USER LIST ================= */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {usersToShow.map((user) => (
          <div
            key={user._id}
            onClick={() => handleUserClick(user)}
            className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer
              ${
                selectedUserId === user._id
                  ? "bg-sky-500 text-white"
                  : "hover:bg-white/10 text-white/80"
              }`}
          >
            <img
              src={user.profilepic}
              className="w-12 h-12 rounded-full object-cover"
              alt=""
            />

            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between w-full">
                <p className="font-semibold text-sm truncate max-w-40">
                  {user.username}
                </p>

                {unreadCounts[user._id] > 0 && (
                  <span className="min-w-5.5 h-5 px-1.5 flex items-center justify-center rounded-full bg-green-500 text-white text-[11px] font-bold">
                    +{unreadCounts[user._id]}
                  </span>
                )}
              </div>

              <p className="text-xs text-white/60">Tap to chat</p>
            </div>
          </div>
        ))}

        {!loading && usersToShow.length === 0 && (
          <p className="text-center text-white/60 mt-10">
            Search users to start chatting
          </p>
        )}
      </div>

      {/* ================= LOGOUT ================= */}
      <button
        onClick={() => {
          localStorage.removeItem("chatapp");
          setauthUser(null);
          navigate("/login");
        }}
        className="flex items-center gap-2 p-3 hover:bg-red-500 rounded-xl"
      >
        <TbLogout2 size={20} />
        Logout
      </button>
    </div>
  );
};

export default SideBar;
