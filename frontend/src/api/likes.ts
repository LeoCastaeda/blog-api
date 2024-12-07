import client from "./apiClient";

// Agregar un like a una publicación
export const addLike = async (postId: number) => {
  const response = await client.post("/api/likes", { postId });
  return response.data;
};

// Eliminar un like de una publicación
export const removeLike = async (postId: number) => {
  const response = await client.delete("/api/likes", { data: { postId } });
  return response.data;
};

// Contar likes de una publicación
export const countLikes = async (postId: number) => {
  const response = await client.get(`/api/likes/${postId}/count`);
  return response.data;
};
