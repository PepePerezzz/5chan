import React from 'react';
import { useAuth } from "../context/AuthContext";

import '../styles/PostCard.css'; 

function PostCard({ post, onEdit }) {
  const { user } = useAuth();

  const isOwner = user && post && user.id === post.id_usuario;

  return (
    <div
      className="post-card"
      onClick={() => isOwner && onEdit && onEdit(post)}
      style={{ cursor: isOwner ? 'pointer' : 'default' }}
    >
      <p className="post-text">{post.texto}</p>
      <span className="post-author">— {post.categoria}</span>
    </div>
  );
}

export default PostCard;