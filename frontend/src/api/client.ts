const API_BASE_URL = "http://localhost:3000";

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("authToken");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    const contentType = response.headers.get("Content-Type");
    const isJson = contentType && contentType.includes("application/json");

    if (!response.ok) {
      const errorData = isJson ? await response.json() : await response.text();
      throw new Error(isJson ? errorData.message : errorData || "Error al realizar la solicitud");
    }

    return isJson ? await response.json() : response.text();
  } catch (error) {
    console.error("Error en apiClient:", error);
    throw new Error(error instanceof Error ? error.message : "Error desconocido");
  }
};
