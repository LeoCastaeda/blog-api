import React, { useEffect, useState } from "react";
import { getPostById } from "../../api/posts";

interface PostDetailsProps {
  postId: number;
}

const PostDetails: React.FC<PostDetailsProps> = ({ postId }) => {
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(postId);
        setPost(data);
      } catch (err) {
        console.error("Error al obtener el post:", err);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) return <p>Cargando publicación...</p>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <p>Autor: {post.authorId}</p>
    </div>
  );
};

export default PostDetails;
