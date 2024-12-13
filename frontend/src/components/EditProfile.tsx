import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { apiClient } from "../api/client";

const EditProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await apiClient(`/api/users/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, 
        },
        body: JSON.stringify(formData),
      });

      if (updatedUser) {
      updateUser(updatedUser);
        }  
      setFormError(null);
    } catch (err: any) {
      console.error("Error al actualizar el perfil:", err);
      setFormError(err.message || "Error al actualizar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Editar Perfil</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre de usuario:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Contraseña:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </label>
        {formError && <p style={{ color: "red" }}>{formError}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Actualizando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;




