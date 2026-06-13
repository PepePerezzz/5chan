import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

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
            alert(
                error.response?.data?.mensaje ||
                "Error al iniciar sesión"
            );
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <Link to="/" className="back-btn">
                    ← Volver al Feed
                </Link>
                <h1 className="login-title">
                    Bienvenido a 5Chan
                </h1>
                <p className="login-subtitle">
                    Comparte ideas, pensamientos y reflexiones.
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        className="login-input"
                        type="email"
                        placeholder="Correo electrónico"
                        value={correo}
                        onChange={(e) =>
                            setCorreo(e.target.value)
                        }
                    />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <button
                        className="login-button"
                        type="submit"
                    >
                        Iniciar sesión
                    </button>
                    <Link to="/register" className="register-btn">
                     Crear una cuenta
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Login;