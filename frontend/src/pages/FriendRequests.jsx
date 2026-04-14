import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "https://convo-chatwebsite-backend.onrender.com/api/friend/requests",
        { withCredentials: true },
      );
      setRequests(res.data);
    } catch {
      toast.error("Failed to load requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const acceptRequest = async (id) => {
    try {
      await axios.post(
        `https://convo-chatwebsite-backend.onrender.com/api/friend/accept/${id}`,
        {},
        { withCredentials: true },
      );

      toast.success("Accepted");
      fetchRequests();

      // 🔥 IMPORTANT (for now)
      window.location.reload();
    } catch {
      toast.error("Failed");
    }
  };

  const rejectRequest = async (id) => {
    try {
      await axios.post(
        `https://convo-chatwebsite-backend.onrender.com/api/friend/reject/${id}`,
        {},
        { withCredentials: true },
      );

      toast.success("Rejected");
      fetchRequests();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="p-5 text-white">
      <h2 className="text-xl mb-4">Friend Requests</h2>

      {requests.length === 0 && <p className="text-gray-400">No requests</p>}

      {requests.map((req) => (
        <div
          key={req._id}
          className="flex items-center justify-between bg-gray-800 p-3 rounded mb-3"
        >
          <div className="flex items-center gap-3">
            <img
              src={req.sender.profilepic}
              className="w-10 h-10 rounded-full"
            />
            <p>{req.sender.username}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => acceptRequest(req._id)}
              className="bg-green-500 px-3 py-1 rounded"
            >
              Accept
            </button>

            <button
              onClick={() => rejectRequest(req._id)}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequests;
