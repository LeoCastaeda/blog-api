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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [sortCriteria, setSortCriteria] = useState<string>("dateDesc");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await apiClient("/api/posts/details");
        setPosts(data);
      } catch (err: any) {
        setError("Error al cargar las publicaciones.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  const handleLikeToggle = async (postId: number, likedByUser: boolean) => {
    try {
      const method = likedByUser ? "DELETE" : "POST";
      const response = await apiClient("/api/likes", {
        method,
        body: JSON.stringify({ postId }),
      });
  
      const data = await response;
  
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likedByUser: !likedByUser,
                likes: likedByUser ? post.likes - 1 : post.likes + 1,
              }
            : post
        )
      );
  
      setSuccessMessage(data.message || "Operación realizada con éxito.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError("Error al gestionar el like.");
      setTimeout(() => setError(null), 3000);
    }
  };
  

  const sortedPosts = posts.sort((a, b) => {
    switch (sortCriteria) {
      case "dateAsc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "dateDesc":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "popularityAsc":
        return a.popularity - b.popularity;
      case "popularityDesc":
        return b.popularity - a.popularity;
      case "authorAsc":
        return a.author.localeCompare(b.author);
      case "authorDesc":
        return b.author.localeCompare(a.author);
      default:
        return 0;
    }
  });

  if (!user) return <p>Cargando usuario...</p>;

  return (
    <div>
      <h1>Bienvenido, {user.username}!</h1>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {loading ? (
        <p>Cargando publicaciones...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <div>
            <label>Ordenar por:</label>
            <select onChange={(e) => setSortCriteria(e.target.value)}>
              <option value="dateDesc">Fecha (Nuevas primero)</option>
              <option value="dateAsc">Fecha (Antiguas primero)</option>
              <option value="popularityDesc">Popularidad (Alta a Baja)</option>
              <option value="popularityAsc">Popularidad (Baja a Alta)</option>
              <option value="authorAsc">Autor (A-Z)</option>
              <option value="authorDesc">Autor (Z-A)</option>
            </select>
          </div>
          <ul>
            {sortedPosts.map((post) => (
              <li key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <p>
                  <strong>Autor:</strong> {post.author}
                </p>
                <p>
                  <strong>Popularidad:</strong> {post.popularity}
                </p>
                <small>
                  Creado el: {new Date(post.createdAt).toLocaleString()}
                </small>
                <button onClick={() => handleLikeToggle(post.id, post.likedByUser)}>
                  {post.likedByUser ? "👎 Unlike" : "👍 Like"}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Home;







