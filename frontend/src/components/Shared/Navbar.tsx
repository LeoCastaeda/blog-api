import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/posts">Publicaciones</Link></li>
        <li><Link to="/users">Usuarios</Link></li>
        <li><Link to="/login">Iniciar Sesión</Link></li>
        <li><Link to="/register">Registrarse</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;

