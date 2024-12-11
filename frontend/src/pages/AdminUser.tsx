import React, { useEffect, useState } from "react";
import { apiClient } from "../api/client";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  banned: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiClient("/api/users");
        setUsers(data);
      } catch (err: any) {
        setError("Error al cargar usuarios.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBan = async (userId: number) => {
    try {
      await apiClient(`/api/users/${userId}/ban`, { method: "POST" });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, banned: true } : user
        )
      );
    } catch {
      setError("Error al banear al usuario.");
    }
  };

  const handleUnban = async (userId: number) => {
    try {
      await apiClient(`/api/users/${userId}/unban`, { method: "POST" });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, banned: false } : user
        )
      );
    } catch {
      setError("Error al desbanear al usuario.");
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      await apiClient(`/api/users/${userId}`, { method: "DELETE" });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch {
      setError("Error al eliminar al usuario.");
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre de Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Baneado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.banned ? "Sí" : "No"}</td>
              <td>
                {user.banned ? (
                  <button onClick={() => handleUnban(user.id)}>Reactivar</button>
                ) : (
                  <button onClick={() => handleBan(user.id)}>Banear</button>
                )}
                <button onClick={() => handleDelete(user.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
