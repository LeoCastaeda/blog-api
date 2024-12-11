import React, { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import { useAuth } from "../context/AuthProvider";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  popularity: number;
  createdAt: string;
  updatedAt: string;
  likes: number;
  likedByUser: boolean; 
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await apiClient("/api/posts/details");
        setPosts(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar las publicaciones");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLikeToggle = async (postId: string, likedByUser: boolean) => {
    try {
      let response;
  
      if (likedByUser) {
       
        response = await apiClient("/api/likes", {
          method: "DELETE",
          body: JSON.stringify({ postId }),
        });
      } else {
       
        response = await apiClient("/api/likes", {
          method: "POST",
          body: JSON.stringify({ postId }),
        });
      }
  
      console.log("Respuesta del servidor:", response);
  
      
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === Number(postId)
            ? {
                ...post,
                likes: response.likes,
                popularity: response.popularity,
                likedByUser: !likedByUser,
              }
            : post
        )
      );
    } catch (err: any) {
      
      setError("Ya has dado like a este post.");
    }
  };
  
  

  if (!user) return <p>Cargando usuario...</p>;

  return (
    <div>
      <h1>Bienvenido, {user.username}!</h1>
      {loading ? (
        <p>Cargando publicaciones...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p><strong>Autor:</strong> {post.author}</p>
              <p><strong>Popularidad:</strong> {post.popularity}</p>
              
              <small>
                Creado el: {new Date(post.createdAt).toLocaleString()}
              </small>
              <button
                onClick={() => handleLikeToggle(post.id.toString(), post.likedByUser)}
              >
                {post.likedByUser ? "👎 Unlike" : "👍 Like"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;


