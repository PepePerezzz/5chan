import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";
import "../styles/Feed.css";

function Feed() {
  //Post fake para probar
const posts = [
  {
    id: 1,
    author: "Leonardo",
    text: "La disciplina supera a la motivación."
  },
  {
    id: 2,
    author: "Ana",
    text: "Hoy aprendí React."
  },
  {
    id: 3,
    author: "Carlos",
    text: "Pensamiento corto."
  }
];

  return (
    <>
      <Navbar></Navbar>
      <div className="feed-container">
        <div className="masonry">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              author={post.author}
              text={post.text}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Feed;