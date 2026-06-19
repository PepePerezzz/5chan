import React, { useState, useEffect } from "react";
import "../styles/PinCarousel.css";

function PinCarousel({ posts }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (posts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
    }, 4000); 

    return () => clearInterval(interval);
  }, [posts.length]);

  if (posts.length === 0) return null;

  return (
    <div className="carousel-container">
      <div className="carousel-track">
        {posts.map((post, index) => (
          <div
            key={post.id_pin}
            className={`carousel-slide ${index === currentIndex ? "active" : ""}`}
          >
            <p className="carousel-text">"{post.texto}"</p>
            <span className="carousel-category">{post.categoria}</span>
          </div>
        ))}
      </div>

      <div className="carousel-dots">
        {posts.map((_, index) => (
          <span
            key={index}
            className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

export default PinCarousel;