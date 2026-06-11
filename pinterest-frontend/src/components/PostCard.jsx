/*import "../styles/PostCard.css";

function PostCard({ author, text }) {
  return (
    <div className="post-card">
      <p>{text}</p>
      <span className="post-author">
        {author}
      </span>

    </div>
  );
}

export default PostCard;
*/

import React from 'react';

function PostCard({ author, text }) {
  return (
    <div style={cardStyle}>
      <p style={textStyle}>{text}</p>
      <span style={authorStyle}>— {author}</span>
    </div>
  );
}

// 🖌️ Te dejo unos estilos rápidos aquí mismo para que no ocupe el archivo .css por ahora
const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '16px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  border: '1px solid #eaeaea',
  wordBreak: 'break-word',   
  overflow: 'hidden'
};

const textStyle = {
  fontSize: '16px',
  color: '#333333',
  marginBottom: '10px',
  lineHeight: '1.5',
  fontWeight: '500',
  whiteSpace: 'pre-wrap', 
};

const authorStyle = {
  fontSize: '13px',
  color: '#767676',
  fontWeight: 'bold'
};

export default PostCard;