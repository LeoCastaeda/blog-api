import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";  
const AdminRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;