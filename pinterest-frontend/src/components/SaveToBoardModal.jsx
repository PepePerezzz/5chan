import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "../styles/CreatePinModal.css";
import "../styles/Boards.css";

/**
 * Modal para guardar un pin del Feed en uno de los tableros del usuario.
 * Lista los tableros (selección por radio) y delega el guardado en onSave.
 */
function SaveToBoardModal({ isOpen, onClose, boards, onSave, loading = false }) {
  const [selected, setSelected] = useState(null);

  if (!isOpen) return null;

  const handleSave = () => {
    if (selected) onSave(selected);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <h2 className="modal-title">Guardar en tablero</h2>

        {boards.length === 0 ? (
          <p className="board-empty-hint">
            Aún no tienes tableros.{" "}
            <Link to="/profile/boards" onClick={onClose}>Crea uno desde tu perfil</Link>.
          </p>
        ) : (
          <div className="board-select-list">
            {boards.map((b) => (
              <label
                key={b.id_tablero}
                className={`board-select-item ${selected === b.id_tablero ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="board"
                  value={b.id_tablero}
                  checked={selected === b.id_tablero}
                  onChange={() => setSelected(b.id_tablero)}
                />
                <span className="board-select-name">{b.nombre}</span>
                <span className="board-select-count">{b.total_pines || 0} pines</span>
              </label>
            ))}
          </div>
        )}

        <button
          type="button"
          className="modal-submit-btn"
          disabled={!selected || loading}
          onClick={handleSave}
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
}

SaveToBoardModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  boards: PropTypes.arrayOf(
    PropTypes.shape({
      id_tablero: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      total_pines: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    })
  ).isRequired,
  onSave: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default SaveToBoardModal;
