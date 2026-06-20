import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/Feed.css";

function PinDetails() {
  // Leemos el parámetro dinámico :id de la URL (/pin/:id)
  const { id } = useParams();

  const [pin, setPin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPin = async () => {
      try {
        // El backend no expone /pins/:id, así que pedimos todos
        // y buscamos el que coincide con el id de la URL.
        const res = await api.get("/pins");
        const encontrado = res.data.find(
          (p) => String(p.id_pin) === String(id)
        );

        if (!encontrado) {
          setError("No se encontró el pin solicitado.");
        } else {
          setPin(encontrado);
        }
      } catch (err) {
        console.error(err);
        setError("Error al cargar el pin desde el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchPin();
  }, [id]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      <div className="feed-container" style={{ maxWidth: "700px", margin: "0 auto" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <h2>Cargando pin...</h2>
          </div>
        ) : error ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <p style={{ fontSize: "18px", color: "#c0392b" }}>{error}</p>
            <Link to="/" style={{ color: "#b97843" }}>← Volver al Feed</Link>
          </div>
        ) : (
          <div className="post-card" style={{ padding: "30px" }}>
            <span
              style={{
                display: "inline-block",
                background: "#b97843",
                color: "white",
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "13px",
                marginBottom: "16px",
              }}
            >
              {pin.categoria}
            </span>

            <h2 style={{ marginBottom: "10px", color: "#38291e" }}>
              {pin.descripcion}
            </h2>

            <p style={{ fontSize: "17px", lineHeight: "1.6", color: "#4a3a2c", whiteSpace: "pre-wrap" }}>
              {pin.texto}
            </p>

            <div style={{ marginTop: "24px" }}>
              <Link to="/" style={{ color: "#b97843", fontWeight: "bold" }}>
                ← Volver al Feed
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PinDetails;
