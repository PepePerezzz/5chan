import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {

  const { user, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/?busqueda=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleLogoClick = () => {
    setSearchValue("");
    navigate("/");
  };

  const handleReset = () => {
    setSearchValue("");
    setSearchParams({});
    navigate("/");
  };

  return (
    <nav className="navbar">

      <Link to="/" className="logo" onClick={handleLogoClick}>
        5Chan
      </Link>

      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            className="search-input"
            type="text"
            placeholder="Buscar publicaciones..."
            value={searchValue}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
          />
        </form>
        <button
          className="reset-btn"
          onClick={handleReset}
          title="Limpiar búsqueda y mostrar todas las publicaciones"
        >
          ✕
        </button>
      </div>

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