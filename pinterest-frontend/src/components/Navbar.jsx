import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {

  const { user, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        5Chan
      </Link>

      <input
        className="search-input"
        type="text"
        placeholder="Buscar publicaciones..."
      />

      <div className="navbar-right">

        {user ? (
          <div className="user-menu">

            <button className="user-btn" onClick={toggleMenu}>
              {user.nombre} ▾
            </button>

            {openMenu && (
              <div className="dropdown">

                <Link to="/profile" className="dropdown-item">
                  Perfil
                </Link>

                {user.rol === "admin" && (
                  <Link to="/admin" className="dropdown-item">
                    Panel Admin
                  </Link>
                )}

                <button
                  className="dropdown-item logout"
                  onClick={logout}
                >
                  Cerrar sesión
                </button>

              </div>
            )}

          </div>
        ) : (
          <Link className="login-btn" to="/login">
            Iniciar sesión
          </Link>
        )}

      </div>

    </nav>
  );
}

export default Navbar;