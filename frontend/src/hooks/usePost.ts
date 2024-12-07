import { useState, useEffect } from "react";
import { getAllPosts } from "../api/posts";

const usePosts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (err) {
        setError("Error al cargar las publicaciones");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
};

export default usePosts;
