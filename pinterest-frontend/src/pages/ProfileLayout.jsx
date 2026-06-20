import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import usePins from "../hooks/usePins";
import useBoards from "../hooks/useBoards";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles/Feed.css";
import "../styles/Profile.css";

import { FiGrid, FiFolder, FiBookmark, FiUser, FiMail } from "react-icons/fi";

/**
 * Layout del perfil con rutas anidadas.
 *   /profile          -> ProfilePins  (index)
 *   /profile/boards   -> ProfileBoards
 * Carga una sola vez los pines y tableros del usuario y los comparte con las
 * rutas hijas mediante el context del <Outlet />, evitando peticiones duplicadas.
 */
function ProfileLayout() {
  const { user } = useAuth();
  const { pins, setPins, loading: pinsLoading } = usePins();
  const boardsApi = useBoards();

  const userPins = pins.filter((p) => p.id_usuario === user?.id);

  return (
    <div className="profile-page">
      <Navbar />
      <ToastContainer />

      <div className="profile-header">
        <div className="avatar-wrapper">
          <div className="avatar-box">
            {user?.nombre ? user.nombre.charAt(0).toUpperCase() : <FiUser />}
          </div>
        </div>

        <h1 className="user-name">{user?.nombre || "Usuario"}</h1>

        <div className="user-meta-row">
          <span className="meta-item">
            <FiMail className="meta-icon" /> {user?.correo}
          </span>
          <span className="role-badge">{user?.rol || "usuario"}</span>
        </div>

        <div className="stats-container">
          <div className="stat-box">
            <span className="stat-number">{userPins.length}</span>
            <span className="stat-label">
              <FiBookmark className="meta-icon" /> Pines
            </span>
          </div>
          <div className="dividing-line"></div>
          <div className="stat-box">
            <span className="stat-number">{boardsApi.boards.length}</span>
            <span className="stat-label">
              <FiFolder className="meta-icon" /> Tableros
            </span>
          </div>
        </div>
      </div>

      <div className="tab-container">
        <NavLink
          to="/profile"
          end
          className={({ isActive }) => `tab-btn ${isActive ? "active" : ""}`}
        >
          <FiGrid style={{ marginRight: "8px" }} /> Mis Pines
        </NavLink>
        <NavLink
          to="/profile/boards"
          className={({ isActive }) => `tab-btn ${isActive ? "active" : ""}`}
        >
          <FiFolder style={{ marginRight: "8px" }} /> Mis Tableros
        </NavLink>
      </div>

      <div className="feed-container">
        <Outlet
          context={{
            user,
            userPins,
            setPins,
            pinsLoading,
            ...boardsApi
          }}
        />
      </div>
    </div>
  );
}

export default ProfileLayout;
