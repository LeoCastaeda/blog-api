import React, { useEffect, useState } from "react";
import { findUserById } from "../../api/users";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  banned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface UserProfileProps {
  userId: number;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await findUserById(userId);
        setUser(data);
      } catch (err) {
        console.error("Error al obtener el usuario:", err);
      }
    };

    fetchUser();
  }, [userId]);

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div>
      <h2>{user.username}</h2>
      <p>Email: {user.email}</p>
      <p>Rol: {user.role}</p>
      {user.banned !== undefined && <p>Baneado: {user.banned ? "Sí" : "No"}</p>}
      {user.createdAt && <p>Creado: {new Date(user.createdAt).toLocaleString()}</p>}
      {user.updatedAt && <p>Actualizado: {new Date(user.updatedAt).toLocaleString()}</p>}
    </div>
  );
};

export default UserProfile;

