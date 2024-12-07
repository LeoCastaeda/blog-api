import React, { useEffect, useState } from "react";
import { getAllPosts } from "../../api/posts";

const PostList: React.FC = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (err) {
        console.error("Error al obtener publicaciones:", err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Lista de Publicaciones</h2>
      <ul>
        {posts.map((post: any) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
