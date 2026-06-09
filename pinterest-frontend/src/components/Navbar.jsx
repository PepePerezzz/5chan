import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        5Chan
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="Buscar publicaciones..."
      />

      <div className="profile-btn">
        Perfil
      </div>
    </nav>
  );
}

export default Navbar;