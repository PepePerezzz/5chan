import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";


import "../styles/Feed.css"; 
import "../styles/Profile.css"; 


import { FiGrid, FiFolder, FiBookmark, FiUser, FiMail, FiLayers } from "react-icons/fi";

function Profile() {
  const { user } = useAuth();
  const [userPins, setUserPins] = useState([]);
  const [activeTab, setActiveTab] = useState("pins"); 
  const [loading, setLoading] = useState(true);

  const mockBoards = [
    { id: 1, nombre: "Frases", conteo: 0 },
    { id: 2, nombre: "Memes", conteo: 0 },
    { id: 3, nombre: "Naturaleza", conteo: 0 },
  ];

  useEffect(() => {
    const abortController = new AbortController();
    const token = localStorage.getItem("token");

    const fetchMyPins = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/pins", {
          signal: abortController.signal,
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Filtramos comparando el id_usuario del pin con el id de la sesión actual
        const misPinesFiltrados = res.data.filter(pin => pin.id_usuario === user?.id);
        
        setUserPins(misPinesFiltrados);
        setLoading(false);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Error al cargar los pines:", error);
          setLoading(false);
        }
      }
    };

    if (user?.id) {
      fetchMyPins();
    }
    
    return () => abortController.abort();
  }, [user]);

  return (
    <div className="profile-page">
      <Navbar />
      
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
            <span className="stat-number">{mockBoards.length}</span>
            <span className="stat-label">
              <FiFolder className="meta-icon" /> Tableros
            </span>
          </div>
        </div>
      </div>

      
      <div className="tab-container">
        <button 
          className={`tab-btn ${activeTab === "pins" ? "active" : ""}`}
          onClick={() => setActiveTab("pins")}
        >
          <FiGrid style={{ marginRight: "8px" }} /> Mis Pines
        </button>
        <button 
          className={`tab-btn ${activeTab === "boards" ? "active" : ""}`}
          onClick={() => setActiveTab("boards")}
        >
          <FiFolder style={{ marginRight: "8px" }} /> Mis Tableros
        </button>
      </div>

     
      <div className="feed-container">
        {loading ? (
          <div className="info-message">Cargando tu colección...</div>
        ) : activeTab === "pins" ? (
          userPins.length === 0 ? (
            <div className="info-message">
              <FiBookmark style={{ fontSize: "2rem", marginBottom: "10px", color: "#c9a67d" }} />
              <p>Aún no has creado ningún pin de texto.</p>
            </div>
          ) : (
            <div className="masonry">
              {userPins.map((pin) => (
                <PostCard
                  key={pin.id_pin}
                  author={pin.categoria}
                  category={pin.descripcion}
                  text={pin.texto}
                />
              ))}
            </div>
          )
        ) : (
          
          <div className="board-grid">
            {mockBoards.map((board) => (
              <div key={board.id} className="board-card">
                <div className="board-preview">
                  <FiLayers style={{ fontSize: "2.2rem", color: "#8a6a52" }} />
                </div>
                <div className="board-info">
                  <h3 className="board-title">{board.nombre}</h3>
                  <p className="board-count">{board.conteo} publicaciones</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;