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
import api from "../services/api";

function Feed() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingPost, setEditingPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    api.get('/pins')
      .then((respuesta) => {
        setPosts(respuesta.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const busqueda = searchParams.get('busqueda');

    if (!busqueda || busqueda.trim() === '') {
      setFilteredPosts(posts);
    } else {
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

      const respuesta = await api.post(
        "/pins",
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

  const handleUpdatePost = async (updatedData) => {
    try {
      if (!editingPost) return;

      const datosParaBD = {
        categoria: updatedData.category,
        descripcion: updatedData.description,
        texto: updatedData.text
      };

      const token = localStorage.getItem("token");

      const respuesta = await api.put(
        `/pins/${editingPost.id_pin}`,
        datosParaBD,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const updatedPost = respuesta.data;

      setPosts(posts.map(p => (p.id_pin === updatedPost.id_pin ? { ...p, ...updatedPost } : p)));

      toast.success("Pin actualizado correctamente", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });

      setEditingPost(null);
      setModalMode('create');

    } catch (error) {
      console.error("Error al actualizar el pin:", error);
      toast.error("Error: No se pudo conectar con el servidor o falló la actualización.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Navbar />
      <ToastContainer />

      <div className="feed-container">
        <div className="masonry">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id_pin}
                post={post}
                onEdit={(p) => {
                  setEditingPost(p);
                  setModalMode('edit');
                  setIsModalOpen(true);
                }}
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

      {user && (
        <>
          <button
            style={floatingButtonStyle}
            onClick={() => { setIsModalOpen(true); setModalMode('create'); setEditingPost(null); }}
            title="Crear nuevo pin de texto"
          >
            +
          </button>

          <CreatePinModal
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false); }}
            onCreatePin={modalMode === 'edit' ? handleUpdatePost : handleCreatePost}
            initialData={modalMode === 'edit' ? editingPost : null}
            mode={modalMode}
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
