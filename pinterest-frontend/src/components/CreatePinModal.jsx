import React, { useState } from 'react';

function CreatePinModal({ isOpen, onClose, onCreatePin }) {
  // 1. Estados para controlar lo que escribe el usuario (Formulario Controlado)
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  // Si el modal está cerrado, no renderiza nada
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // 2. Validaciones obligatorias tanto en Front como en Back (Rúbrica)
    if (!category.trim() || !description.trim() || !text.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setError(''); // Limpiamos errores si todo está bien

    // Creamos el objeto con los datos del nuevo Pin de texto
    const newPin = {
      category,
      description,
      text
    };

    //enviamos los datos al componente padre (Feed)
    onCreatePin(newPin);

    // Limpiamos el formulario y cerramos el modal
    setCategory('');
    setDescription('');
    setText('');
    onClose();
  };

  return (
    // Fondo difuminado que cubre toda la pantalla (Backdrop)
    <div style={styles.backdrop} onClick={onClose}>
      {/* Caja del Modal (onClick detiene la propagación para que no se cierre al dar clic adentro) */}
      <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>✕</button>
        
        <h2 style={styles.title}>📌 Crear Nuevo Pin de Texto</h2>
        
        {error && <p style={styles.errorText}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Categoría:</label>
          <input 
            type="text" 
            placeholder="Ej. Motivación, Poesía, Frases" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Descripción corta:</label>
          <input 
            type="text" 
            placeholder="¿De qué trata este pensamiento?" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Tu Texto / Pensamiento:</label>
          <textarea 
            placeholder="Escribe aquí tu frase o texto largo..." 
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={styles.textarea}
            rows="5"
          />

          <button type="submit" style={styles.submitButton}>Publicar Pin</button>
        </form>
      </div>
    </div>
  );
}

// 🖌️ Estilos CSS en línea para que no te pelees con archivos externos
const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semitransparente
    backdropFilter: 'blur(8px)', // ✨ Efecto de difuminado (Blur) pedido
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Asegura que esté por encima de todo el feed
  },
  modalBox: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#333',
  },
  title: {
    marginBottom: '20px',
    fontSize: '22px',
    color: '#222',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
    fontSize: '14px',
    color: '#555',
  },
  input: {
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  textarea: {
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
    resize: 'none',
  },
  submitButton: {
    backgroundColor: '#b97843', // Rojo Pinterest original
    color: '#fff',
    border: 'none',
    padding: '12px',
    borderRadius: '24px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  errorText: {
    color: '#b97843',
    fontWeight: 'bold',
    fontSize: '14px',
    marginBottom: '15px',
    textAlign: 'center',
  }
};

export default CreatePinModal;