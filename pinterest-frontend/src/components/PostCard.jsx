import "../styles/PostCard.css";

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