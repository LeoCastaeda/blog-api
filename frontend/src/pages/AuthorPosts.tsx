import React, { useEffect, useState } from "react";
import { apiClient } from "../api/client";

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

interface AuthorPostsPageProps {
  authorId?: number;
}

const AuthorPostsPage: React.FC<AuthorPostsPageProps> = ({ authorId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!authorId) {
      setError("ID de autor no disponible.");
      setLoading(false);
      return;
    }

    const fetchAuthorPosts = async () => {
      try {
        const response = await apiClient(`/api/posts/author/${authorId}`);
        const data = response.map((item: { props: Post }) => item.props);
        setPosts(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar las publicaciones del autor.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorPosts();
  }, [authorId]);

  const handleEdit = (post: Post) => {
    setEditingPost(post);
  };

  const handleSave = async () => {
    if (editingPost) {
      try {
        await apiClient(`/api/posts/${editingPost.id}`, {
          method: "PUT",
          body: JSON.stringify(editingPost),
        });

        // Actualizar el post en el estado local
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === editingPost.id ? editingPost : post
          )
        );

        setEditingPost(null);
      } catch (err) {
        console.error(err);
        setError("Error al guardar los cambios.");
      }
    }
  };

  const handleCancel = () => {
    setEditingPost(null);
  };

  if (loading) return <p>Cargando publicaciones...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Publicaciones del Autor {authorId}</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id}>
            {editingPost?.id === post.id ? (
              <div>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, title: e.target.value })
                  }
                />
                <textarea
                  value={editingPost.content}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, content: e.target.value })
                  }
                />
                <button onClick={handleSave}>Guardar</button>
                <button onClick={handleCancel}>Cancelar</button>
              </div>
            ) : (
              <>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <button onClick={() => handleEdit(post)}>Editar</button>
              </>
            )}
          </div>
        ))
      ) : (
        <p>No hay publicaciones para este autor.</p>
      )}
    </div>
  );
};

export default AuthorPostsPage;



