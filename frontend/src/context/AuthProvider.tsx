import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiClient } from "../api/client";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  banned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateUser: (newUserData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      apiClient("/api/auth/me")
        .then((response) => {
          setToken(savedToken);
          setUserState(response.user);
          localStorage.setItem("authUser", JSON.stringify(response.user));
        })
        .catch(() => {
          logout(); 
        });
    }
  }, []);

  const setUser = (updatedUser: User | null) => {
    setUserState(updatedUser);
    if (updatedUser) {
      localStorage.setItem("authUser", JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem("authUser");
    }
  };

  const updateUser = async (newUserData: Partial<User>): Promise<void> => {
    if (!user) return;
    try {
      const updatedUser = await apiClient(`/api/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(newUserData),
      });
      setUser({ ...user, ...updatedUser.data });
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  const login = (token: string, userData: User) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem("authToken", token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export default AuthProvider;

