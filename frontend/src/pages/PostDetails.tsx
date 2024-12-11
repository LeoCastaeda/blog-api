import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

const PostDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError("El ID del post no está definido.");
        setLoading(false);
        return;
      }

      try {
        const data = await apiClient(`/api/posts/${id}`, { method: "GET" });
        setPost(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar la publicación");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p>Cargando publicación...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      {post ? (
        <>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
          <p><strong>Autor:</strong> {post.author}</p>
          <p><strong>Popularidad:</strong> {post.popularity}</p>
          <small>
            Creado el: {new Date(post.createdAt).toLocaleString()}
          </small>
        </>
      ) : (
        <p>No se encontró la publicación.</p>
      )}
    </div>
  );
};

export default PostDetails;


