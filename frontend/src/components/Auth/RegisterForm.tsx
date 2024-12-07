import React, { useState } from "react";
import { registerUser } from "../../api/auth";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "simpleUser",
  });
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(formData.username, formData.email, formData.password, formData.role);
      setError("");
      alert("Registro exitoso.");
    } catch (err) {
      setError("Error al registrar. Por favor, inténtelo de nuevo.");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Registro</h2>
      <div>
        <label>Nombre de Usuario:</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />
      </div>
      <div>
        <label>Contraseña:</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
      </div>
      <div>
        <label>Rol:</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="SimpleUser">Usuario</option>
          <option value="Admin">Administrador</option>
        </select>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Registrarse</button>
    </form>
  );
};

export default RegisterForm;
