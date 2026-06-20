import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";

import "../styles/Feed.css";
import "../styles/Profile.css";

import { FiArrowLeft, FiFolder } from "react-icons/fi";

// /boards/:boardId -> muestra todos los pines guardados en un tablero del usuario.
function BoardDetail() {
  const { boardId } = useParams();

  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchBoard = async () => {
      try {
        const res = await api.get(`/boards/${boardId}`, {
          signal: controller.signal,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setBoard(res.data);
        setLoading(false);
      } catch (err) {
        // Si la petición se abortó (StrictMode/desmontaje), no tocamos el estado.
        if (axios.isCancel(err)) return;
        if (err.response?.status === 403) {
          setError("No tienes acceso a este tablero.");
        } else if (err.response?.status === 404) {
          setError("El tablero no existe.");
        } else {
          setError("No se pudo cargar el tablero.");
        }
        setLoading(false);
      }
    };

    fetchBoard();
    return () => controller.abort();
  }, [boardId]);

  return (
    <div className="profile-page">
      <Navbar />

      {loading ? (
        <Loader message="Cargando tablero..." />
      ) : error ? (
        <div className="feed-container">
          <div className="info-message">
            <p style={{ color: "#c0392b" }}>{error}</p>
            <Link to="/profile/boards" style={{ color: "#b97843", fontWeight: 600 }}>
              ← Volver a mis tableros
            </Link>
          </div>
        </div>
      ) : board ? (
        <>
          <div className="profile-header">
            <div className="avatar-wrapper">
              <div className="avatar-box">
                <FiFolder />
              </div>
            </div>
            <h1 className="user-name">{board.nombre}</h1>
            <div className="user-meta-row">
              <span className="meta-item">{board.total_pines} pines guardados</span>
            </div>
          </div>

          <div className="feed-container">
            <div style={{ maxWidth: 1100, margin: "0 auto 18px auto" }}>
              <Link to="/profile/boards" style={{ color: "#b97843", fontWeight: 600 }}>
                <FiArrowLeft style={{ verticalAlign: "middle", marginRight: 6 }} />
                Volver a mis tableros
              </Link>
            </div>

            {board.pines.length === 0 ? (
              <div className="info-message">
                <p>Este tablero aún no tiene pines. Guarda alguno desde el feed.</p>
              </div>
            ) : (
              <div className="masonry">
                {board.pines.map((pin) => (
                  <PostCard key={pin.id_pin} post={pin} />
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default BoardDetail;
