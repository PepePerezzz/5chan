import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";
import CreatePinModal from "../components/CreatePinModal";
import SaveToBoardModal from "../components/SaveToBoardModal";
import Loader from "../components/Loader";
import usePins from "../hooks/usePins";
import useBoards from "../hooks/useBoards";
import "../styles/Feed.css";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../services/api";

function Feed() {
  const { user } = useAuth();

  // Carga de pines centralizada en el hook personalizado usePins.
  const { pins: posts, setPins: setPosts, loading } = usePins();
  // Tableros del usuario (para el modal "Guardar en tablero").
  const { boards, addPinToBoard } = useBoards();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingPost, setEditingPost] = useState(null);
  const [searchParams] = useSearchParams();

  // Estado del modal "Guardar en tablero".
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [pinToSave, setPinToSave] = useState(null);
  const [savingBoard, setSavingBoard] = useState(false);

  // Filtrado derivado de los pines + el query param ?busqueda (sin estado extra).
  const filteredPosts = useMemo(() => {
    const busqueda = searchParams.get('busqueda');

    if (!busqueda || busqueda.trim() === '') {
      return posts;
    }

    const termino = busqueda.toLowerCase();
    return posts.filter(post =>
      (post.categoria || "").toLowerCase().includes(termino) ||
      (post.descripcion || "").toLowerCase().includes(termino) ||
      (post.texto || "").toLowerCase().includes(termino)
    );
  }, [searchParams, posts]);

  if (loading) {
    return <Loader message="Cargando pensamientos desde la base de datos..." />;
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
        { headers: { Authorization: `Bearer ${token}` } }
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
        { headers: { Authorization: `Bearer ${token}` } }
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

  const openSaveModal = (post) => {
    setPinToSave(post);
    setSaveModalOpen(true);
  };

  const handleSaveToBoard = async (boardId) => {
    if (!pinToSave) return;
    try {
      setSavingBoard(true);
      await addPinToBoard(boardId, pinToSave.id_pin);
      toast.success("Pin guardado en el tablero", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      setSaveModalOpen(false);
      setPinToSave(null);
    } catch (error) {
      if (error.response?.status === 409) {
        toast.info("Ese pin ya está en el tablero", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        console.error("Error al guardar el pin en el tablero:", error);
        toast.error("No se pudo guardar el pin en el tablero.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setSavingBoard(false);
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
                onSave={user ? openSaveModal : undefined}
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

          <SaveToBoardModal
            isOpen={saveModalOpen}
            onClose={() => { setSaveModalOpen(false); setPinToSave(null); }}
            boards={boards}
            onSave={handleSaveToBoard}
            loading={savingBoard}
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
