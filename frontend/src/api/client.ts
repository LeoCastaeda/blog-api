

const API_BASE_URL = "http://localhost:3000"; 

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("authToken"); 

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al realizar la solicitud");
  }

  return response.json();
};
