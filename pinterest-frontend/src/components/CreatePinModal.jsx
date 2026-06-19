import React, { useState, useEffect } from 'react';
import '../styles/CreatePinModal.css'; 

function CreatePinModal({ isOpen, onClose, onCreatePin, initialData = null, mode = 'create' }) {
  const [category, setCategory] = useState(initialData ? initialData.categoria : '');
  const [description, setDescription] = useState(initialData ? initialData.descripcion : '');
  const [text, setText] = useState(initialData ? initialData.texto : '');
  const [error, setError] = useState('');

  // sincronizar campos cuando cambie initialData o se abra el modal en modo edit
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setCategory(initialData.categoria || '');
      setDescription(initialData.descripcion || '');
      setText(initialData.texto || '');
    } else if (mode === 'create') {
      // Limpiar campos cuando se abre en modo crear
      setCategory('');
      setDescription('');
      setText('');
      setError('');
    }
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!category.trim() || !description.trim() || !text.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setError('');

    const newPin = {
      category,
      description,
      text
    };

    onCreatePin(newPin);

    if (mode === 'create') {
      setCategory('');
      setDescription('');
      setText('');
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        
        <h2 className="modal-title">{mode === 'edit' ? 'Editar Pin' : 'Crear Nuevo Pin de Texto'}</h2>
        
        {error && <p className="modal-error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="modal-form">
          <label className="modal-label">Categoría:</label>
          <input 
            type="text" 
            placeholder="Ej. Motivación, Poesía, Frases" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="modal-input"
          />

          <label className="modal-label">Descripción corta:</label>
          <input 
            type="text" 
            placeholder="¿De qué trata este pensamiento?" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="modal-input"
          />

          <label className="modal-label">Tu Texto / Pensamiento:</label>
          <textarea 
            placeholder="Escribe aquí tu frase o texto largo..." 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="modal-textarea"
            rows="5"
          />

          <button type="submit" className="modal-submit-btn">{mode === 'edit' ? 'Guardar cambios' : 'Publicar Pin'}</button>
        </form>
      </div>
    </div>
  );
}

export default CreatePinModal;