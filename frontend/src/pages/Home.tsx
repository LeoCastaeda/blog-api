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
      } catch {
        setError("Error al cargar las publicaciones.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  const handleLike = async (postId: number, author: string) => {
    if (user?.username === author) {
      setError("No puedes dar like a tu propio post.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const response = await apiClient(`/api/likes`, {
        method: "POST",
        body: JSON.stringify({ postId })
      });
      if (response.message === "Ya tiene un like") {
        setSuccessMessage("Ya diste like a este post.");
      } else {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, likedByUser: true, likes: post.likes + 1 }
              : post
          )
        );
        setSuccessMessage("Like agregado con éxito.");
      }
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setError("Error al dar like al post.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleUnlike = async (postId: number) => {
    try {
      await apiClient(`/api/likes`, { method: "DELETE", body: JSON.stringify({ postId }) });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likedByUser: false, likes: post.likes - 1 }
            : post
        )
      );
      setSuccessMessage("Like eliminado con éxito.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setError("Error al quitar el like del post.");
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
                <button
                  onClick={() =>
                    post.likedByUser
                      ? handleUnlike(post.id)
                      : handleLike(post.id, post.author)
                  }
                  disabled={user?.username === post.author}
                >
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









