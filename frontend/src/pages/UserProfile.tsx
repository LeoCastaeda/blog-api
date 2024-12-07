import React from "react";
import { useParams } from "react-router-dom";
import UserProfile from "../components/Users/UserProfile";

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <div>
      <h1>Perfil de Usuario</h1>
      {userId ? (
        <UserProfile userId={parseInt(userId, 10)} />
      ) : (
        <p>No se especificó un usuario.</p>
      )}
    </div>
  );
};

export default UserProfilePage;

