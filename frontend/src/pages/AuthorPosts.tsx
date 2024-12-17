import React, { useEffect, useState } from "react";
import { apiClient } from "../api/client";

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
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
        const response = await apiClient(`/api/posts/author/${authorId}?includeDeleted=true`);
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

  const handleDelete = async (postId: number) => {
    try {
      await apiClient(`/api/posts/${postId}`, { method: "DELETE" });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, deleted: true } : post
        )
      );
    } catch (err) {
      console.error(err);
      setError("Error al eliminar la publicación.");
    }
  };

  const handleRecover = async (postId: number) => {
    try {
      await apiClient(`/api/posts/${postId}/recover`, { method: "POST" });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, deleted: false } : post
        )
      );
    } catch (err) {
      console.error(err);
      setError("Error al recuperar la publicación.");
    }
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
                {!post.deleted ? (
                  <>
                    <button onClick={() => handleEdit(post)}>Editar</button>
                    <button onClick={() => handleDelete(post.id)}>Eliminar</button>
                  </>
                ) : (
                  <button onClick={() => handleRecover(post.id)}>Recuperar</button>
                )}
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


