import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./home/Homepage";
import Login from "./Login";
import { ToastContainer } from "react-toastify";
import { VarifyUser } from "./utils/VarifyUser";
import ProfileDashboard from "./home/ProfileDashboard";
import Background from "./home/Components/Background";

const App = () => {
  return (
    <BrowserRouter>
      <div className="h-[100dvh] flex justify-center items-center">
        <Background />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="" element={<VarifyUser />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/dashboard" element={<ProfileDashboard />} />
          </Route>
        </Routes>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
};

export default App;
