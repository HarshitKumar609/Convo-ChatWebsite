import React, { useState } from "react";
import { useAuth } from "../Context/Authcontext";
import SideBar from "./Components/SideBar";
import MessageBar from "./Components/MessageBar";

const Homepage = () => {
  const { authUser } = useAuth();

  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebarVisible(false);
  };

  const handleShowSidebar = () => {
    setIsSidebarVisible(true);
    setSelectedUser(null);
  };

  return (
    <div className="w-full h-[100dvh] p-0 md:px-3 md:py-3 ">
      {/* MAIN GLASS CONTAINER (ONLY BLUR HERE) */}
      <div
        className="
          w-full h-full
          flex flex-col lg:flex-row gap-1
        "
      >
        {/* Sidebar */}
        <div
          className={`
            h-full
            ${isSidebarVisible ? "flex" : "hidden"}
            lg:flex lg:min-w-88
          `}
        >
          <SideBar onSelectUser={handleUserSelect} />
        </div>

        {/* Chat Area */}
        <div
          className={`
            flex-1 h-full
            rounded-2xl
            bg-white/5
            border border-white/10

            ${!isSidebarVisible && selectedUser ? "flex" : "hidden"}
            lg:flex
          `}
        >
          <MessageBar
            selectedUser={selectedUser}
            onBackUser={handleShowSidebar}
          />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
