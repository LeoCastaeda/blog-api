import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../api/users";

const UserList: React.FC = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error al obtener usuarios:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>
            <p>Nombre: {user.username}</p>
            <p>Email: {user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
