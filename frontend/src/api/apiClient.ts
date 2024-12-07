import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3000", // Base URL del backend
  headers: {
    "Content-Type": "application/json",
    
  },
});

// Interceptor para agregar el token de autorización
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Obtén el token de localStorage o de donde lo guardes
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Agrega el token al encabezado Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;
