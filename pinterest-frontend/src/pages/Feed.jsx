import React, { useState, useEffect } from "react"; 
import axios from "axios";                         
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";
import CreatePinModal from "../components/CreatePinModal";
import "../styles/Feed.css";

function Feed() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  //useEffect para pedir los textos al Backend en cuanto cargue la pagina
  useEffect(() => {
    //Axios con una Promesa (.then / .catch)
    axios.get('http://localhost:3000/api/pins') //se crea la Promesa
    .then((respuesta) => {
    //Si la promesa se CUMPLE (Fulfilled), entramos aqui
    //Recibimos los los datos de MySQL y los guardamos
    setPosts(respuesta.data); 
    setLoading(false);
  })
  .catch((error) => {
    //si la promesa se RECHAZA, brinca directo aqui
    // Atrapamos el error y avisamos al usuario.
    console.error(error);
    setLoading(false);
  });
  }, []); 

  //Renderizado condicional de carga: Si está cargando, muestra un mensaje
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Cargando pensamientos desde la base de datos... </h2>
      </div>
    );
  }


const handleCreatePost = async (newPostData) => {
    try {
      const datosParaBD = {
        categoria: newPostData.category,
        descripcion: newPostData.description,
        texto: newPostData.text
      };

      const respuesta = await axios.post('http://localhost:3000/api/pins', datosParaBD);
      
      const postGuardado = respuesta.data;
      setPosts([postGuardado, ...posts]);
      
      alert("¡Pensamiento guardado con éxito en MySQL! 📌");

    } catch (error) {
      console.error("Error al guardar en la base de datos:", error);
      alert("Error: No se pudo conectar con el servidor o falló el guardado.");
    }
  };

return (
    // un div relativo para que el boton pueda flotar
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Navbar />
      
      <div className="feed-container">
        <div className="masonry">
          {posts.map((post) => (
            <PostCard
              key={post.id_pin}       
              author={post.categoria}  
              category={post.descripcion} 
              text={post.texto}        
            />
          ))}
        </div>
      </div>

      {/* 4. BOTÓN FLOTANTE: Diseñado con CSS en línea para no alterar el archivo Feed.css de tu compañero */}
      <button 
        style={floatingButtonStyle} 
        onClick={() => setIsModalOpen(true)}
        title="Crear nuevo pin de texto"
      >
        +
      </button>

      {/* 5. COMPONENTE MODAL: Oculto por defecto, se activa con el botón */}
      <CreatePinModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreatePin={handleCreatePost}
      />
    </div>
  );
}


const floatingButtonStyle = {
  position: "fixed",
  bottom: "40px",
  right: "40px",
  backgroundColor: "#b97843", 
  color: "white",
  border: "none",
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  fontSize: "36px",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "transform 0.2s ease",
  zIndex: 999, 
};

export default Feed;