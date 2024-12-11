import React from "react";
import { Link } from "react-router-dom";

const Error404: React.FC = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <Link to="/" style={{ textDecoration: "none", color: "blue" }}>
        Volver al inicio
      </Link>
    </div>
  );
};

export default Error404;
