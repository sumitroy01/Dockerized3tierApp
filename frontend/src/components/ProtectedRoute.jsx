import React from "react";
import { Navigate } from "react-router-dom";
import userStore from "../store/userstore";

const ProtectedRoute = ({ children }) => {
  const { authUser, isCheckingAuth } = userStore();

  if (isCheckingAuth) {
    return <div className="text-center mt-10">Checking authentication...</div>;
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
