import client from "./apiClient";

// Obtener todos los usuarios
export const getAllUsers = async () => {
  const response = await client.get("/api/users");
  return response.data;
};

// Obtener un usuario por ID
export const findUserById = async (id: number) => {
  const response = await client.get(`/api/users/${id}`);
  return response.data;
};

// Actualizar el perfil de un usuario
export const updateUserProfile = async (id: number, data: { username?: string; email?: string; role?: string }) => {
  const response = await client.put(`/api/users/${id}`, data);
  return response.data;
};

// Banear a un usuario
export const banUser = async (id: number) => {
  const response = await client.post(`/api/users/${id}/ban`);
  return response.data;
};

// Desbanear a un usuario
export const unbanUser = async (id: number) => {
  const response = await client.post(`/api/users/${id}/unban`);
  return response.data;
};
