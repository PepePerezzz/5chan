import React, { useState } from 'react';
import '../styles/CreatePinModal.css'; 

function CreatePinModal({ isOpen, onClose, onCreatePin }) {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

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

    setCategory('');
    setDescription('');
    setText('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        
        <h2 className="modal-title">Crear Nuevo Pin de Texto</h2>
        
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

          <button type="submit" className="modal-submit-btn">Publicar Pin</button>
        </form>
      </div>
    </div>
  );
}

export default CreatePinModal;