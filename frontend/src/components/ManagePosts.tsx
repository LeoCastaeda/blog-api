import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { apiClient } from "../api/client";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const ManagePosts: React.FC = () => {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      const response = await apiClient("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          authorId: user?.id,
        }),
      });
      const createdPost: Post = response;

      setSuccessMessage("Publicación creada con éxito.");
      setNewPost({ title: "", content: "" });
      setFormError(null);
      console.log("Publicación creada:", createdPost);
    } catch (error: any) {
      setFormError(error.message || "Error al crear la publicación.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  return (
    <div>
      <h2>Crear nueva publicación</h2>
      {formError && <p style={{ color: "red" }}>{formError}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
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
        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear"}
        </button>
      </form>
    </div>
  );
};

export default ManagePosts;




