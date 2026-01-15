import React, { useEffect, useRef, useState } from "react";
import { IoArrowBack, IoSend } from "react-icons/io5";
import { PiChatsBold } from "react-icons/pi";
import axios from "axios";
import userConversation from "../../zustand/UserConversation";
import { useAuth } from "../../Context/Authcontext";
import { useSocketContext } from "../../Context/SocketCon";
import notify from "../../assets/Sound/notificationSound.mp3";

const MessageBar = ({ onBackUser }) => {
  const { selectedConversation, messages, setMessages, addMessage } =
    userConversation();

  const { authUser } = useAuth();
  const { socket } = useSocketContext();

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendData, setSendData] = useState("");

  const bottomRef = useRef(null);

  /* ================= SOCKET LISTENER ================= */
  useEffect(() => {
    if (!socket || !selectedConversation) return;

    const handleNewMessage = ({ message }) => {
      // Check if message belongs to currently open chat
      const isCurrentChat =
        message.senderId === selectedConversation._id ||
        message.ReceiverId === selectedConversation._id;

      if (!isCurrentChat) return; //  ignore other chats

      const sound = new Audio(notify);
      sound.play();

      addMessage(message);
    };

    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedConversation, addMessage]);

  /* ================= FETCH MESSAGES ================= */
  useEffect(() => {
    if (!selectedConversation?._id) return;

    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://convo-chatwebsite-backend.onrender.com/api/message/${selectedConversation._id}`,
          { withCredentials: true }
        );
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [selectedConversation?._id, setMessages]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sendData.trim()) return;

    setSending(true);
    try {
      const res = await axios.post(
        ` https://convo-chatwebsite-backend.onrender.com/api/message/send/${selectedConversation._id}`,
        { message: sendData },
        { withCredentials: true }
      );

      addMessage(res.data);
      setSendData("");
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col text-white">
      {/* EMPTY STATE */}
      {!selectedConversation ? (
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="text-center flex flex-col items-center gap-4">
            <p className="text-3xl md:text-5xl font-bold">
              Welcome ✌️ {authUser?.username}
            </p>
            <p className="text-lg md:text-2xl text-gray-400">
              Let’s start chatting with your friends
            </p>
            <PiChatsBold size={90} className="text-sky-500" />
          </div>
        </div>
      ) : (
        <>
          {/* HEADER */}
          <div className="flex items-center gap-3 bg-gray-800 px-3 h-14 border-b border-gray-800 rounded-2xl">
            <button
              onClick={onBackUser}
              className="lg:hidden p-2 rounded-full bg-gray-800 hover:bg-gray-700"
            >
              <IoArrowBack size={22} />
            </button>

            <img
              src={selectedConversation.profilepic}
              alt="profile"
              className="w-9 h-9 rounded-full object-cover"
            />

            <span className="font-semibold text-lg">
              {selectedConversation.username}
            </span>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {loading && (
              <div className="flex justify-center">
                <div className="w-10 h-10 border-4 border-gray-700 border-t-sky-500 rounded-full animate-spin"></div>
              </div>
            )}

            {!loading &&
              messages.map((message) => {
                const isMe = message.senderId === authUser._id;

                return (
                  <div
                    key={message._id}
                    className={`flex flex-col ${
                      isMe ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`flex items-end gap-2 w-full ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isMe && (
                        <img
                          src={selectedConversation.profilepic}
                          alt="avatar"
                          className="w-8 h-8 rounded-full"
                        />
                      )}

                      <div
                        className={`w-fit max-w-full sm:max-w-[75%] px-4 py-2 rounded-2xl text-sm
                        ${
                          isMe
                            ? "bg-linear-to-r from-sky-500 to-sky-600 rounded-br-none"
                            : "bg-gray-800 rounded-bl-none"
                        }`}
                      >
                        {message.message}
                      </div>

                      {isMe && (
                        <img
                          src={authUser.profilepic}
                          alt="avatar"
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                    </div>

                    <span
                      className={`text-[11px] text-gray-400 mt-1 ${
                        isMe ? "pr-10 text-right" : "pl-10"
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <form onSubmit={handleSubmit} className="p-3">
            <div className="flex items-center gap-2 bg-gray-800 rounded-2xl px-3 py-2">
              <textarea
                value={sendData}
                onChange={(e) => setSendData(e.target.value)}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 resize-none bg-transparent outline-none text-sm text-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />

              <button
                type="submit"
                disabled={sending}
                className={`p-2 w-10 rounded-full ${
                  sending
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-gray-900 hover:bg-gray-100"
                }`}
              >
                <IoSend
                  size={22}
                  className={sending ? "text-gray-400" : "text-sky-600"}
                />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default MessageBar;
