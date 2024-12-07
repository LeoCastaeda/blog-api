import client from "./apiClient";

// Crear una nueva publicación
export const createPost = async (title: string, content: string, authorId: number) => {
  const response = await client.post("/api/posts", {
    title,
    content,
    authorId,
  });
  return response.data;
};

// Obtener todas las publicaciones
export const getAllPosts = async () => {
  const response = await client.get("/api/posts");
  return response.data;
};

// Obtener una publicación por ID
export const getPostById = async (id: number) => {
  const response = await client.get(`/api/posts/${id}`);
  return response.data;
};

// Eliminar (soft-delete) una publicación
export const softDeletePost = async (id: number) => {
  const response = await client.delete(`/api/posts/${id}`);
  return response.data;
};

// Recuperar una publicación eliminada
export const recoverPost = async (id: number) => {
  const response = await client.post(`/api/posts/${id}/recover`);
  return response.data;
};

// Obtener publicaciones con detalles adicionales
export const getPostsWithDetails = async () => {
  const response = await client.get("/api/posts/details");
  return response.data;
};
