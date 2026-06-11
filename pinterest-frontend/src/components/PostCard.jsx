import React from 'react';

import '../styles/PostCard.css'; 

function PostCard({ author, text }) {
  return (
    <div className="post-card">
      <p className="post-text">{text}</p>
      <span className="post-author">— {author}</span>
    </div>
  );
}

export default PostCard;