import PropTypes from "prop-types";

// Loader simple usado como fallback de <Suspense> (Lazy Loading) y como
// indicador de carga reutilizable. Respeta la paleta del proyecto.
function Loader({ message = "Cargando..." }) {
  return (
    <div style={loaderStyle}>
      <div style={spinnerStyle} />
      <p style={{ color: "#8a7365", marginTop: 16, fontWeight: 600 }}>{message}</p>
      <style>
        {`@keyframes spin5chan { to { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
}

const loaderStyle = {
  minHeight: "60vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "#f8f5f0"
};

const spinnerStyle = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  border: "4px solid #e3d8ca",
  borderTopColor: "#b97843",
  animation: "spin5chan 0.8s linear infinite"
};

Loader.propTypes = {
  message: PropTypes.string
};

export default Loader;
