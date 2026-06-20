import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

// Cabecera de autorización reutilizando el token ya guardado en localStorage,
// igual que en el resto del proyecto.
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

/**
 * Hook personalizado: administra los tableros del usuario autenticado.
 * Expone la lista de tableros y las acciones CRUD + guardar pin.
 * Lo usan ProfileLayout, ProfileBoards y Feed (modal "Guardar en tablero").
 */
export default function useBoards() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBoards = useCallback(async () => {
    // Si no hay sesión no pedimos nada (evita 401 para invitados en el Feed).
    if (!localStorage.getItem("token")) {
      setBoards([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get("/boards", authHeader());
      setBoards(res.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar los tableros:", err);
      setError("No se pudieron cargar los tableros.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const createBoard = async (nombre) => {
    const res = await api.post("/boards", { nombre }, authHeader());
    setBoards((prev) => [res.data, ...prev]);
    return res.data;
  };

  const updateBoard = async (id, nombre) => {
    const res = await api.put(`/boards/${id}`, { nombre }, authHeader());
    setBoards((prev) =>
      prev.map((b) => (b.id_tablero === id ? { ...b, nombre: res.data.nombre } : b))
    );
    return res.data;
  };

  const deleteBoard = async (id) => {
    await api.delete(`/boards/${id}`, authHeader());
    setBoards((prev) => prev.filter((b) => b.id_tablero !== id));
  };

  const addPinToBoard = async (boardId, pinId) => {
    const res = await api.post(`/boards/${boardId}/pins`, { id_pin: pinId }, authHeader());
    setBoards((prev) =>
      prev.map((b) =>
        b.id_tablero === boardId
          ? { ...b, total_pines: Number(b.total_pines || 0) + 1 }
          : b
      )
    );
    return res.data;
  };

  return {
    boards,
    loading,
    error,
    fetchBoards,
    createBoard,
    updateBoard,
    deleteBoard,
    addPinToBoard
  };
}
