import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; 
import axios from "axios";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";
import CreatePinModal from "../components/CreatePinModal";
import "../styles/Feed.css";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PinCarousel from "../components/PinCarousel";

function Feed() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
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

  //useEffect para filtrar posts según el parámetro de búsqueda
  useEffect(() => {
    const busqueda = searchParams.get('busqueda');

    if (!busqueda || busqueda.trim() === '') {
      //Si no hay parámetro de búsqueda, mostrar todos los posts
      setFilteredPosts(posts);
    } else {
      //Filtrar posts donde categoria, descripcion o texto contenga el término de búsqueda
      const termino = busqueda.toLowerCase();
      const resultados = posts.filter(post =>
        (post.categoria || "").toLowerCase().includes(termino) ||
        (post.descripcion || "").toLowerCase().includes(termino) ||
        (post.texto || "").toLowerCase().includes(termino)
      );
      setFilteredPosts(resultados);
    }
  }, [searchParams, posts]);
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

    const token = localStorage.getItem("token");

    const respuesta = await axios.post(
      "http://localhost:3000/api/pins",
      datosParaBD,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const postGuardado = respuesta.data;
    setPosts([postGuardado, ...posts]);

    toast.success("¡Pensamiento guardado con exito!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
    });

  } catch (error) {
    console.error("Error al guardar en la base de datos:", error);
    toast.error("Error: No se pudo conectar con el servidor o falló el guardado.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
    });
  }
};

return (
    // un div relativo para que el boton pueda flotar
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Navbar />
      <ToastContainer />

      <PinCarousel posts={filteredPosts.slice(0, 8)} />

      <div className="feed-container">
        <div className="masonry">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id_pin}
                idPin={post.id_pin}
                author={post.categoria}
                category={post.descripcion}
                text={post.texto}
                autorNombre={post.autor_nombre}
                idUsuarioAutor={post.id_usuario}
              />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ fontSize: '18px', color: '#999' }}>
                {searchParams.get('busqueda') ? 'No se encontraron resultados' : 'No hay publicaciones'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. BOTÓN FLOTANTE: Diseñado con CSS en línea para no alterar el archivo Feed.css de tu compañero */}
      {user && (
        <>
          <button
            style={floatingButtonStyle}
            onClick={() => setIsModalOpen(true)}
            title="Crear nuevo pin de texto"
          >
            +
          </button>

          <CreatePinModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreatePin={handleCreatePost}
          />
        </>
      )}
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