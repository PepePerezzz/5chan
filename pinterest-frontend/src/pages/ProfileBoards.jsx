import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import CreateBoardModal from "../components/CreateBoardModal";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FiFolder, FiPlus, FiEdit2, FiTrash2, FiLayers } from "react-icons/fi";

import "../styles/Boards.css";

// Ruta hija /profile/boards: lista, crea, edita y elimina los tableros del usuario.
function ProfileBoards() {
  const { boards, loading, createBoard, updateBoard, deleteBoard } = useOutletContext();
  const navigate = useNavigate();

  const [createOpen, setCreateOpen] = useState(false);
  const [editBoard, setEditBoard] = useState(null);

  const handleCreate = async (nombre) => {
    try {
      await createBoard(nombre);
      toast.success("Tablero creado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo crear el tablero");
    }
  };

  const handleEdit = async (nombre) => {
    if (!editBoard) return;
    try {
      await updateBoard(editBoard.id_tablero, nombre);
      toast.success("Tablero actualizado");
      setEditBoard(null);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar el tablero");
    }
  };

  const handleDelete = (board) => {
    Swal.fire({
      title: "¿Eliminar tablero?",
      text: `Se eliminará el tablero "${board.nombre}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#8a7365",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#fcfbfa",
      color: "#38291e"
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await deleteBoard(board.id_tablero);
        Swal.fire({
          title: "¡Eliminado!",
          text: "El tablero se eliminó correctamente.",
          icon: "success",
          confirmButtonColor: "#b97843",
          background: "#fcfbfa",
          color: "#38291e"
        });
      } catch (error) {
        Swal.fire({
          title: "No se pudo eliminar",
          text: error.response?.data?.mensaje || "Intenta de nuevo.",
          icon: "error",
          confirmButtonColor: "#b97843",
          background: "#fcfbfa",
          color: "#38291e"
        });
      }
    });
  };

  if (loading) {
    return <div className="info-message">Cargando tus tableros...</div>;
  }

  return (
    <>
      <div className="boards-toolbar">
        <button className="board-create-btn" onClick={() => setCreateOpen(true)}>
          <FiPlus /> Crear tablero
        </button>
      </div>

      {boards.length === 0 ? (
        <div className="info-message">
          <FiFolder style={{ fontSize: "2rem", marginBottom: "10px", color: "#c9a67d" }} />
          <p>Aún no tienes tableros. Crea el primero para organizar tus pines.</p>
        </div>
      ) : (
        <div className="board-grid">
          {boards.map((board) => (
            <div key={board.id_tablero} className="board-card">
              <div
                className="board-preview"
                onClick={() => navigate(`/boards/${board.id_tablero}`)}
              >
                <FiLayers style={{ fontSize: "2.2rem", color: "#8a6a52" }} />
              </div>
              <div className="board-info">
                <div className="board-info-row">
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/boards/${board.id_tablero}`)}
                  >
                    <h3 className="board-title">{board.nombre}</h3>
                    <p className="board-count">{board.total_pines || 0} publicaciones</p>
                  </div>
                  <div className="board-actions">
                    <button
                      className="board-action-btn"
                      title="Editar nombre"
                      onClick={() => setEditBoard(board)}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="board-action-btn danger"
                      title="Eliminar tablero"
                      onClick={() => handleDelete(board)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateBoardModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        mode="create"
      />

      <CreateBoardModal
        isOpen={!!editBoard}
        onClose={() => setEditBoard(null)}
        onSubmit={handleEdit}
        initialName={editBoard?.nombre || ""}
        mode="edit"
      />
    </>
  );
}

export default ProfileBoards;
