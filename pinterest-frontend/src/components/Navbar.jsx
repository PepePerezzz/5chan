import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "../styles/Navbar.css";

function Navbar() {

  const { user, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [usuariosSugeridos, setUsuariosSugeridos] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchContainerRef = useRef(null);

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  // Buscar usuarios mientras se escribe (con debounce)
  useEffect(() => {
    if (searchValue.trim().length < 2) {
      setUsuariosSugeridos([]);
      return;
    }

    const timer = setTimeout(() => {
      axios
        .get(`http://localhost:3000/api/usuarios/buscar?nombre=${encodeURIComponent(searchValue.trim())}`)
        .then((respuesta) => {
          setUsuariosSugeridos(respuesta.data);
          setMostrarSugerencias(true);
        })
        .catch((error) => {
          console.error("Error al buscar usuarios:", error);
        });
    }, 300); // espera 300ms después de que dejas de teclear

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Cerrar el dropdown si das clic fuera de la barra de búsqueda
  useEffect(() => {
    const handleClickFuera = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setMostrarSugerencias(false);
      }
    };

    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setMostrarSugerencias(false);
      navigate(`/?busqueda=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleClickUsuario = (idUsuario) => {
    setSearchValue("");
    setMostrarSugerencias(false);
    navigate(`/profile/${idUsuario}`);
  };

  const handleLogoClick = () => {
    setSearchValue("");
    navigate("/");
  };

  const handleReset = () => {
    setSearchValue("");
    setMostrarSugerencias(false);
    setSearchParams({});
    navigate("/");
  };

  return (
    <nav className="navbar">

      <Link to="/" className="logo" onClick={handleLogoClick}>
        5Chan
      </Link>

      <div className="search-container" ref={searchContainerRef}>
        <form onSubmit={handleSearch} className="search-form">
          <input
            className="search-input"
            type="text"
            placeholder="Buscar publicaciones o usuarios..."
            value={searchValue}
            onChange={handleInputChange}
            onFocus={() => searchValue.trim().length >= 2 && setMostrarSugerencias(true)}
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

        {mostrarSugerencias && usuariosSugeridos.length > 0 && (
          <div className="search-dropdown">
            <p className="search-dropdown-label">Usuarios</p>
            {usuariosSugeridos.map((usuario) => (
              <button
                key={usuario.id_usuario}
                className="search-dropdown-item"
                onClick={() => handleClickUsuario(usuario.id_usuario)}
              >
                {usuario.nombre}
              </button>
            ))}
          </div>
        )}
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