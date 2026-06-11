/*import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";
import "../styles/Feed.css";

function Feed() {
  //Post fake para probar 
  // 😂
const posts = [
  {
    id: 1,
    author: "Leonardo",
    text: "La disciplina supera a la motivación. Si quieres lograr algo, hazlo todos los días, incluso cuando no tengas ganas. "
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

export default Feed;*/

import React, { useState, useEffect } from "react"; // 🌟 Revisa que tenga 'useEffect' adentro
import axios from "axios";                         // 🌟 ¡Esta línea es obligatoria para las peticiones!
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";
import CreatePinModal from "../components/CreatePinModal";
import "../styles/Feed.css";

function Feed() {
// 1. Control del Modal (Ya lo tenías)
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. Estado para guardar los posts que vengan de la base de datos (Empieza vacío)
  const [posts, setPosts] = useState([]);

  // 3. Estado de carga obligatorio por rúbrica (Empieza en true)
  const [loading, setLoading] = useState(true);

  // 4. useEffect para pedir los textos al Backend en cuanto cargue la página
  useEffect(() => {
    // Aquí usamos Axios con una Promesa (.then / .catch) como pide el PDF
    axios.get('http://localhost:3000/api/pins')
      .then((respuesta) => {
        // Guardamos los registros de la base de datos en nuestro estado
        setPosts(respuesta.data); 
        setLoading(false); // Apagamos el mensaje de "Cargando..."
      })
      .catch((error) => {
        console.error("Error al conectar con el servidor:", error);
        setLoading(false); // Apagamos el cargando aunque falle
      });
  }, []); // Los corchetes vacíos aseguran que solo se ejecute al montar el componente

  // 5. Renderizado condicional de carga: Si está cargando, muestra un mensaje
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Cargando pensamientos desde la base de datos... ⏳</h2>
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


      // Pregúntale al del Backend si su endpoint es '/api/pins' o '/api/pines'
      const respuesta = await axios.post('http://localhost:3000/api/pins', datosParaBD);
      
      const postGuardado = respuesta.data;
      setPosts([postGuardado, ...posts]);
      
      alert("¡Pensamiento guardado con éxito en MySQL! 📌");

    } catch (error) {
      console.error("Error al guardar en la base de datos:", error);
      alert("❌ Error: No se pudo conectar con el servidor o falló el guardado.");
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

// 🖌️ Estilo del botón flotante redondo (Fijo en la esquina inferior derecha)
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
  zIndex: 999, // Un nivel abajo del fondo difuminado pero arriba de las tarjetas
};

export default Feed;