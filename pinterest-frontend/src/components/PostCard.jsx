import PropTypes from "prop-types";
import { FiBookmark } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

import '../styles/PostCard.css';
import '../styles/Boards.css';

function PostCard({ post, onEdit, onSave }) {
  const { user } = useAuth();

  const isOwner = user && post && user.id === post.id_usuario;

  return (
    <div
      className="post-card"
      onClick={() => isOwner && onEdit && onEdit(post)}
      style={{ cursor: isOwner && onEdit ? 'pointer' : 'default' }}
    >
      <p className="post-text">{post.texto}</p>
      <span className="post-author">— {post.categoria}</span>

      {user && onSave && (
        <button
          className="post-save-btn"
          onClick={(e) => {
            e.stopPropagation();
            onSave(post);
          }}
          title="Guardar en un tablero"
        >
          <FiBookmark style={{ marginRight: 6 }} /> Guardar
        </button>
      )}
    </div>
  );
}

PostCard.propTypes = {
  post: PropTypes.shape({
    id_pin: PropTypes.number,
    id_usuario: PropTypes.number,
    categoria: PropTypes.string,
    descripcion: PropTypes.string,
    texto: PropTypes.string
  }).isRequired,
  onEdit: PropTypes.func,
  onSave: PropTypes.func
};

export default PostCard;
