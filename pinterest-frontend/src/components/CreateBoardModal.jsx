import { useRef, useState } from "react";
import PropTypes from "prop-types";
import "../styles/CreatePinModal.css";

/**
 * Formulario NO CONTROLADO (useRef).
 * A diferencia de CreatePinModal (controlado con useState), aquí el valor del
 * input vive en el propio DOM y solo se lee con la ref al enviar. Reutiliza
 * los estilos del modal existente para mantener la armonía visual.
 */
function CreateBoardModal({ isOpen, onClose, onSubmit, initialName = "", mode = "create" }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const nombre = inputRef.current.value.trim();

    if (!nombre) {
      setError("El nombre del tablero es obligatorio.");
      return;
    }
    if (nombre.length > 100) {
      setError("El nombre no puede superar los 100 caracteres.");
      return;
    }

    setError("");
    onSubmit(nombre);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <h2 className="modal-title">
          {mode === "edit" ? "Editar Tablero" : "Crear Nuevo Tablero"}
        </h2>

        {error && <p className="modal-error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="modal-form">
          <label className="modal-label">Nombre del tablero:</label>
          <input
            ref={inputRef}
            defaultValue={initialName}
            type="text"
            placeholder="Ej. Recetas, Programación, Inspiración"
            className="modal-input"
            autoFocus
          />

          <button type="submit" className="modal-submit-btn">
            {mode === "edit" ? "Guardar cambios" : "Crear tablero"}
          </button>
        </form>
      </div>
    </div>
  );
}

CreateBoardModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialName: PropTypes.string,
  mode: PropTypes.oneOf(["create", "edit"])
};

export default CreateBoardModal;
