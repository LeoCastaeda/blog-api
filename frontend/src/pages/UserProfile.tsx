import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { apiClient } from "../api/client";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  popularity: number;
  createdAt: string;
  updatedAt: string;
}

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await apiClient("/api/posts/details");
        setPosts(data);
      } catch (err: any) {
        setFormError(err.message || "Error al cargar las publicaciones");
      }
    };

    fetchPosts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPost.title || !newPost.content) {
      setFormError("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const createdPost = await apiClient("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          authorId: user?.id,
        }),
      });
      setPosts([createdPost, ...posts]); 
      setNewPost({ title: "", content: "" });  
      setFormError(null);
    } catch (err: any) {
      setFormError("Error al crear la publicación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Perfil de Usuario</h1>
      <p>Bienvenido, {user?.username}</p>
      <button onClick={logout}>Cerrar sesión</button>

      <h2>Crear nueva publicación</h2>
      <form onSubmit={handleCreatePost}>
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={newPost.title}
          onChange={handleInputChange}
        />
        <textarea
          name="content"
          placeholder="Contenido"
          value={newPost.content}
          onChange={handleInputChange}
        />
        {formError && <p style={{ color: "red" }}>{formError}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear publicación"}
        </button>
      </form>

      <h2>Tus publicaciones</h2>
{formError ? (
  <p style={{ color: "red" }}>{formError}</p>
) : posts.length > 0 ? (
  posts
    .filter((post) => post.author === user?.username) // Filtrar publicaciones del usuario
    .map((post) => (
      <div key={post.id}>
        <h3>{post.title}</h3>
        <p>{post.content}</p>
        <small>Creado el: {new Date(post.createdAt).toLocaleString()}</small>
      </div>
      ))
    ) : (
      <p>No tienes publicaciones.</p>
    )}
    </div>
  );
};

export default UserProfile;


