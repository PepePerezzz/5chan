import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";

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

            alert("Usuario creado correctamente");

            navigate("/login");

        } catch (error) {
            alert(
                error.response?.data?.mensaje ||
                "Error al registrar usuario"
            );
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
                    Registrarse
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