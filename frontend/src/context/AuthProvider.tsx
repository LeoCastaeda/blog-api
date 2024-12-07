import React from "react";
import AuthProvider from "./AuthContext";

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AppProvider;
