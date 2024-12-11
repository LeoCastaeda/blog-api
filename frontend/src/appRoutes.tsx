import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/Shared/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";  
import Navbar from "./components/Shared/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import PostDetails from "./pages/PostDetails";
import AdminUsers from "./pages/adminUser";  
import Error404 from "./pages/Error404";

const AppRoutes: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:id"
              element={
                <ProtectedRoute>
                  <PostDetails />
                </ProtectedRoute>
              }
            />
            {/* Ruta para administración de usuarios */}
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;

