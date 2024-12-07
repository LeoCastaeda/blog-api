import client from "./apiClient";

// Registro de un nuevo usuario
export const registerUser = async (username: string, email: string, password: string, role: string) => {
  const response = await client.post("/api/auth/register", {
    username,
    email,
    password,
    role,
  });
  return response.data;
};

// Iniciar sesión
export const loginUser = async (email: string, password: string) => {
  const response = await client.post("/api/auth/login", { email, password });
  return response.data;
};

// Cerrar sesión
export const logoutUser = async () => {
  const response = await client.post("/api/auth/logout");
  return response.data;
};

// Refrescar token
export const refreshToken = async (token: string) => {
  const response = await client.post("/api/auth/refresh-token", { token });
  return response.data;
};
