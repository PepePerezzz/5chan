import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";
import { FiUserPlus } from "react-icons/fi";
import Swal from "sweetalert2";

function Register() {

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:3000/api/auth/register", {
                nombre,
                correo,
                password
            });

            Swal.fire({
                title: "¡Cuenta creada!",
                text: "Tu usuario ha sido registrado correctamente.",
                icon: "success",
                confirmButtonColor: "#b97843",
                background: "#fcfbfa",
                color: "#38291e"
            });

            navigate("/login");

        } catch (error) {
            Swal.fire({
                title: "Error al registrar",
                text: error.response?.data?.mensaje || "No se pudo crear la cuenta. Inténtalo de nuevo.",
                icon: "error",
                confirmButtonColor: "#b97843",
                background: "#fcfbfa",
                color: "#38291e"
            });
        }
    };

    return (
        <div className="auth-container">

            <form className="auth-card" onSubmit={handleSubmit}>

                <h2>Crear cuenta</h2>

                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">
                    Registrarse <FiUserPlus style={{ marginLeft: "6px", verticalAlign: "middle" }} />
                </button>

                <p>
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login">Inicia sesión</Link>
                </p>

            </form>

        </div>
    );
}

export default Register;