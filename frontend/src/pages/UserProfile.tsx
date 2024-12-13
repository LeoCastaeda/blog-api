import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";  
import EditProfile from "../components/EditProfile";
import ManagePosts from "../components/ManagePosts";
import AuthorPostsPage from "../pages/AuthorPosts";

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "posts" | "authorPosts">("profile");

  if (!user) {
    return <p>Cargando información del usuario...</p>;
  }

  return (
    <div>
      <h1>Perfil de Usuario</h1>
      <p>Bienvenido, {user.username}</p>

      <div>
        <button
          onClick={() => setActiveTab("profile")}
          disabled={activeTab === "profile"}
        >
          Editar Perfil
        </button>
        <button
          onClick={() => setActiveTab("posts")}
          disabled={activeTab === "posts"}
        >
          Crear Publicación
        </button>
        <button
          onClick={() => setActiveTab("authorPosts")}
          disabled={activeTab === "authorPosts"}
        >
          Editar Publicación
        </button>
      </div>

      {activeTab === "profile" && <EditProfile />}
      {activeTab === "posts" && <ManagePosts />}
      {activeTab === "authorPosts" && <AuthorPostsPage authorId={user.id} />}

      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
};

export default UserProfile;
