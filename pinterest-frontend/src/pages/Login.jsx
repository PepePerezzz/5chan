import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

import { FiArrowLeft, FiLogIn, FiUserPlus } from "react-icons/fi";
import Swal from "sweetalert2";

function Login() {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:3000/api/auth/login",
                {
                    correo,
                    password
                }
            );
            login(
                response.data.usuario,
                response.data.token
            );
            navigate("/");
        } catch (error) {
            Swal.fire({
                title: "No se pudo iniciar sesión",
                text: error.response?.data?.mensaje || "Verifica tus credenciales e intenta de nuevo.",
                icon: "error",
                confirmButtonColor: "#b97843",
                background: "#fcfbfa",
                color: "#38291e"
            });
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <Link to="/" className="back-btn">
                    <FiArrowLeft style={{ marginRight: "6px" }} /> Volver al Feed
                </Link>
                
                <h1 className="login-title">
                    Bienvenido a 5Chan
                </h1>
                <p className="login-subtitle">
                    Comparte ideas, pensamientos y reflexiones con toda la comunidad.
                </p>
                
                <form onSubmit={handleSubmit}>
                    <input
                        className="login-input"
                        type="email"
                        placeholder="Correo electrónico"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                    />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        className="login-button"
                        type="submit"
                    >
                        Iniciar sesión <FiLogIn style={{ marginLeft: "6px", verticalAlign: "middle" }} />
                    </button>
                    
                    <Link to="/register" className="register-btn">
                        <FiUserPlus style={{ marginRight: "6px" }} /> Crear una cuenta
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Login;