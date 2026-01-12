import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../Context/Authcontext";

export const VarifyUser = () => {
  const { authUser } = useAuth();

  if (authUser === undefined) return null; // optional safety

  return authUser ? <Outlet /> : <Navigate to="/login" replace />;
};
