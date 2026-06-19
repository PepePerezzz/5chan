import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../styles/BoardSelectorModal.css";
import { createPortal } from "react-dom";

function BoardSelectorModal({ isOpen, onClose, idPin }) {
  const { user, token } = useAuth();
  const [tableros, setTableros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [creando, setCreando] = useState(false);

  useEffect(() => {
    if (!isOpen || !user) return;

    setLoading(true);
    axios
      .get(`http://localhost:3000/api/tableros/usuario/${user.id}`)
      .then((respuesta) => {
        setTableros(respuesta.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [isOpen, user]);

  const handleAgregarATablero = async (id_tablero) => {
    try {
      await axios.post(
        `http://localhost:3000/api/tableros/${id_tablero}/pines`,
        { id_pin: idPin },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Pin agregado al tablero", {
        position: "top-right",
        autoClose: 2000,
      });

      onClose();
    } catch (error) {
      if (error.response?.status === 409) {
        toast.info("Ese pin ya está en este tablero", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.error("No se pudo agregar el pin", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    }
  };

  const handleCrearTablero = async () => {
    if (!nuevoNombre.trim()) return;

    setCreando(true);
    try {
      const respuesta = await axios.post(
        "http://localhost:3000/api/tableros",
        { nombre: nuevoNombre },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTableros([respuesta.data, ...tableros]);
      setNuevoNombre("");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo crear el tablero", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setCreando(false);
    }
  };

if (!isOpen) return null;

  return createPortal(
    <div className="board-modal-overlay" onClick={onClose}>
      <div className="board-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Guardar en tablero</h3>

        {loading ? (
          <p className="board-modal-loading">Cargando tus tableros...</p>
        ) : (
          <div className="board-list">
            {tableros.length === 0 ? (
              <p className="board-modal-empty">Aún no tienes tableros, crea uno abajo</p>
            ) : (
              tableros.map((tablero) => (
                <button
                  key={tablero.id_tablero}
                  className="board-item"
                  onClick={() => handleAgregarATablero(tablero.id_tablero)}
                >
                  {tablero.nombre}
                </button>
              ))
            )}
          </div>
        )}

        <div className="board-create-section">
          <input
            type="text"
            placeholder="Nombre de nuevo tablero"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            className="board-input"
          />
          <button
            className="board-create-btn"
            onClick={handleCrearTablero}
            disabled={creando}
          >
            {creando ? "..." : "Crear"}
          </button>
        </div>

        <button className="board-modal-close" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>,
    document.body
  );
}

export default BoardSelectorModal;