import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import PostCard from "../components/PostCard";
import CreatePinModal from "../components/CreatePinModal";
import api from "../services/api";
import { toast } from "react-toastify";
import { FiBookmark } from "react-icons/fi";

// Ruta hija de /profile (index): muestra los pines del usuario y permite editarlos.
function ProfilePins() {
  const { userPins, setPins, pinsLoading } = useOutletContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const handleUpdatePost = async (updatedData) => {
    if (!editingPost) return;
    try {
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

      // Actualizamos la lista global de pines compartida desde el layout.
      setPins((prev) =>
        prev.map((p) => (p.id_pin === updatedPost.id_pin ? { ...p, ...updatedPost } : p))
      );

      toast.success("Pin actualizado correctamente", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true
      });

      setEditingPost(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar el pin:", error);
      toast.error("Error: No se pudo actualizar el pin.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true
      });
    }
  };

  if (pinsLoading) {
    return <div className="info-message">Cargando tu colección...</div>;
  }

  if (userPins.length === 0) {
    return (
      <div className="info-message">
        <FiBookmark style={{ fontSize: "2rem", marginBottom: "10px", color: "#c9a67d" }} />
        <p>Aún no has creado ningún pin de texto.</p>
      </div>
    );
  }

  return (
    <>
      <div className="masonry">
        {userPins.map((pin) => (
          <PostCard
            key={pin.id_pin}
            post={pin}
            onEdit={(p) => {
              setEditingPost(p);
              setIsModalOpen(true);
            }}
          />
        ))}
      </div>

      <CreatePinModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreatePin={handleUpdatePost}
        initialData={editingPost}
        mode="edit"
      />
    </>
  );
}

export default ProfilePins;
