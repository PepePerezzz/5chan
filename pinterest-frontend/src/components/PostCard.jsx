import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBookmark } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import BoardSelectorModal from './BoardSelectorModal';

import '../styles/PostCard.css';

function PostCard({ idPin, author, category, text, autorNombre, idUsuarioAutor }) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="post-card">
      <p className="post-text">{text}</p>

      <div className="post-footer">
        {autorNombre && idUsuarioAutor ? (
          <Link to={`/profile/${idUsuarioAutor}`} className="post-author-link">
            — {autorNombre}
          </Link>
        ) : (
          <span className="post-author">— {author}</span>
        )}

        {user && (
          <button
            className="save-btn"
            onClick={() => setIsModalOpen(true)}
            title="Guardar en un tablero"
          >
            <FiBookmark />
          </button>
        )}
      </div>

      {user && (
        <BoardSelectorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          idPin={idPin}
        />
      )}
    </div>
  );
}

export default PostCard;