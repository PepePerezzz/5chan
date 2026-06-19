import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import { toast } from "react-toastify";

import "../styles/Feed.css";
import "../styles/Profile.css";

import { FiGrid, FiFolder, FiBookmark, FiUser, FiMail, FiLayers, FiPlus, FiArrowLeft, FiTrash2 } from "react-icons/fi";

function Profile() {
  const { user, token } = useAuth();
  const { id_usuario } = useParams();

  // Si hay id_usuario en la URL, ese es el perfil que vemos. Si no, es el propio.
  const idPerfil = id_usuario ? Number(id_usuario) : user?.id;
  const esMiPerfil = user?.id === idPerfil;

  const [datosUsuario, setDatosUsuario] = useState(null);
  const [userPins, setUserPins] = useState([]);
  const [tableros, setTableros] = useState([]);
  const [tableroActivo, setTableroActivo] = useState(null);
  const [pinesDelTablero, setPinesDelTablero] = useState([]);
  const [activeTab, setActiveTab] = useState("pins");
  const [loading, setLoading] = useState(true);
  const [nuevoNombreTablero, setNuevoNombreTablero] = useState("");
  const [mostrandoCrear, setMostrandoCrear] = useState(false);

  // Traer pines del usuario del perfil (propio o ajeno)
  useEffect(() => {
    if (!idPerfil) return;

    const abortController = new AbortController();

    const fetchPins = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/pins", {
          signal: abortController.signal,
        });

        const pinesDeEsteUsuario = res.data.filter(pin => pin.id_usuario === idPerfil);
        setUserPins(pinesDeEsteUsuario);

        // Si alguno de los pines trae el nombre del autor, lo usamos para el header
        if (pinesDeEsteUsuario.length > 0) {
          setDatosUsuario({ nombre: pinesDeEsteUsuario[0].autor_nombre });
        }

        setLoading(false);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Error al cargar los pines:", error);
          setLoading(false);
        }
      }
    };

    fetchPins();
    return () => abortController.abort();
  }, [idPerfil]);

  // Traer tableros del usuario del perfil (propio o ajeno)
  useEffect(() => {
    if (!idPerfil) return;

    axios
      .get(`http://localhost:3000/api/tableros/usuario/${idPerfil}`)
      .then((res) => setTableros(res.data))
      .catch((error) => console.error("Error al cargar tableros:", error));
  }, [idPerfil]);

  const handleAbrirTablero = async (tablero) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/tableros/${tablero.id_tablero}/pines`);
      setPinesDelTablero(res.data.pines);
      setTableroActivo(tablero);
    } catch (error) {
      console.error("Error al cargar pines del tablero:", error);
      toast.error("No se pudo abrir el tablero");
    }
  };

  const handleCrearTablero = async () => {
    if (!nuevoNombreTablero.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:3000/api/tableros",
        { nombre: nuevoNombreTablero },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTableros([res.data, ...tableros]);
      setNuevoNombreTablero("");
      setMostrandoCrear(false);

      toast.success("Tablero creado");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo crear el tablero");
    }
  };

  const handleEliminarTablero = async (id_tablero) => {
    try {
      await axios.delete(`http://localhost:3000/api/tableros/${id_tablero}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTableros(tableros.filter(t => t.id_tablero !== id_tablero));
      setTableroActivo(null);

      toast.success("Tablero eliminado");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar el tablero");
    }
  };

  const nombreMostrado = esMiPerfil ? user?.nombre : (datosUsuario?.nombre || "Usuario");

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-header">
        <div className="avatar-wrapper">
          <div className="avatar-box">
            {nombreMostrado ? nombreMostrado.charAt(0).toUpperCase() : <FiUser />}
          </div>
        </div>

        <h1 className="user-name">{nombreMostrado}</h1>

        {esMiPerfil && (
          <div className="user-meta-row">
            <span className="meta-item">
              <FiMail className="meta-icon" /> {user?.correo}
            </span>
            <span className="role-badge">{user?.rol || "usuario"}</span>
          </div>
        )}

        <div className="stats-container">
          <div className="stat-box">
            <span className="stat-number">{userPins.length}</span>
            <span className="stat-label">
              <FiBookmark className="meta-icon" /> Pines
            </span>
          </div>
          <div className="dividing-line"></div>
          <div className="stat-box">
            <span className="stat-number">{tableros.length}</span>
            <span className="stat-label">
              <FiFolder className="meta-icon" /> Tableros
            </span>
          </div>
        </div>
      </div>

      <div className="tab-container">
        <button
          className={`tab-btn ${activeTab === "pins" ? "active" : ""}`}
          onClick={() => { setActiveTab("pins"); setTableroActivo(null); }}
        >
          <FiGrid style={{ marginRight: "8px" }} /> {esMiPerfil ? "Mis Pines" : "Pines"}
        </button>
        <button
          className={`tab-btn ${activeTab === "boards" ? "active" : ""}`}
          onClick={() => { setActiveTab("boards"); setTableroActivo(null); }}
        >
          <FiFolder style={{ marginRight: "8px" }} /> {esMiPerfil ? "Mis Tableros" : "Tableros"}
        </button>
      </div>

      <div className="feed-container">
        {loading ? (
          <div className="info-message">Cargando...</div>
        ) : activeTab === "pins" ? (
          userPins.length === 0 ? (
            <div className="info-message">
              <FiBookmark style={{ fontSize: "2rem", marginBottom: "10px", color: "#c9a67d" }} />
              <p>Aún no hay pines de texto.</p>
            </div>
          ) : (
            <div className="masonry">
              {userPins.map((pin) => (
                <PostCard
                  key={pin.id_pin}
                  idPin={pin.id_pin}
                  author={pin.categoria}
                  category={pin.descripcion}
                  text={pin.texto}
                  autorNombre={pin.autor_nombre}
                  idUsuarioAutor={pin.id_usuario}
                />
              ))}
            </div>
          )
        ) : tableroActivo ? (
          // Vista de un tablero abierto, mostrando sus pines
          <div>
            <button className="back-btn" onClick={() => setTableroActivo(null)}>
              <FiArrowLeft /> Volver a tableros
            </button>

            <div className="board-detail-header">
              <h2>{tableroActivo.nombre}</h2>
              {esMiPerfil && (
                <button
                  className="delete-board-btn"
                  onClick={() => handleEliminarTablero(tableroActivo.id_tablero)}
                >
                  <FiTrash2 /> Eliminar tablero
                </button>
              )}
            </div>

            {pinesDelTablero.length === 0 ? (
              <div className="info-message">
                <p>Este tablero todavía no tiene pines.</p>
              </div>
            ) : (
              <div className="masonry">
                {pinesDelTablero.map((pin) => (
                  <PostCard
                    key={pin.id_pin}
                    idPin={pin.id_pin}
                    author={pin.categoria}
                    category={pin.descripcion}
                    text={pin.texto}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          // Vista de la lista de tableros
          <div className="board-grid">
            {esMiPerfil && (
              <div className="board-card board-card-create" onClick={() => setMostrandoCrear(!mostrandoCrear)}>
                <div className="board-preview">
                  <FiPlus style={{ fontSize: "2.2rem", color: "#8a6a52" }} />
                </div>
                <div className="board-info">
                  <h3 className="board-title">Crear tablero</h3>
                </div>
              </div>
            )}

            {tableros.map((board) => (
              <div
                key={board.id_tablero}
                className="board-card"
                onClick={() => handleAbrirTablero(board)}
              >
                <div className="board-preview">
                  <FiLayers style={{ fontSize: "2.2rem", color: "#8a6a52" }} />
                </div>
                <div className="board-info">
                  <h3 className="board-title">{board.nombre}</h3>
                </div>
              </div>
            ))}

            {tableros.length === 0 && !esMiPerfil && (
              <div className="info-message">
                <p>Este usuario aún no tiene tableros.</p>
              </div>
            )}
          </div>
        )}

        {mostrandoCrear && esMiPerfil && (
          <div className="create-board-inline">
            <input
              type="text"
              placeholder="Nombre del tablero"
              value={nuevoNombreTablero}
              onChange={(e) => setNuevoNombreTablero(e.target.value)}
              className="board-input"
            />
            <button onClick={handleCrearTablero} className="board-create-btn">
              Crear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;