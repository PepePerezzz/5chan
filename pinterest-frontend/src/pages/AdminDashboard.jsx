import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/AdminDashboard.css";

import { FiUsers, FiLayers, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [pins, setPins] = useState([]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchUsers();
        fetchPins();
    }, []);

    const fetchUsers = async () => {
        const res = await axios.get("http://localhost:3000/api/users", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setUsers(res.data);
    };

    const fetchPins = async () => {
        const res = await axios.get("http://localhost:3000/api/pins/admin", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setPins(res.data);
    };

    const deleteUser = async (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción revocará el acceso al usuario de forma permanente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74c3c",
            cancelButtonColor: "#8a7365",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            background: "#fcfbfa",
            color: "#38291e"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:3000/api/users/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUsers(users.filter(u => u.id_usuario !== id));
                    
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "La cuenta del usuario ha sido dada de baja correctamente.",
                        icon: "success",
                        confirmButtonColor: "#b97843",
                        background: "#fcfbfa",
                        color: "#38291e"
                    });
                } catch (error) {
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo eliminar al usuario.",
                        icon: "error",
                        confirmButtonColor: "#b97843"
                    });
                }
            }
        });
    };

    const deletePin = async (id) => {
        Swal.fire({
            title: "¿Retirar publicación?",
            text: "El pin se eliminará permanentemente de la galería de 5Chan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e74c3c",
            cancelButtonColor: "#8a7365",
            confirmButtonText: "Sí, retirar",
            cancelButtonText: "Cancelar",
            background: "#fcfbfa",
            color: "#38291e"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:3000/api/pins/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setPins(pins.filter(p => p.id_pin !== id));

                    Swal.fire({
                        title: "¡Contenido Retirado!",
                        text: "El pin ha sido eliminado con éxito.",
                        icon: "success",
                        confirmButtonColor: "#b97843",
                        background: "#fcfbfa",
                        color: "#38291e"
                    });
                } catch (error) {
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo retirar el pin.",
                        icon: "error",
                        confirmButtonColor: "#b97843"
                    });
                }
            }
        });
    };

    return (
        <div>
            <Navbar />

            <div className="admin-container">
                <div className="admin-header-ghost">
                    <div>
                        <h1>Panel de Control</h1>
                        <p>Administración general de la plataforma 5Chan</p>
                    </div>
                    <div className="admin-stats-overview">
                        <div className="stat-box">
                            <h4>Usuarios</h4>
                            <p>{users.length}</p>
                        </div>
                        <div className="stat-box">
                            <h4>Pins</h4>
                            <p>{pins.length}</p>
                        </div>
                    </div>
                </div>

                <section>
                    <h2>
                        <FiUsers style={{ color: "#e67e22" }} /> Cuentas Registradas
                    </h2>
                    <div className="grid">
                        {users.map(user => (
                            <div key={user.id_usuario} className="card">
                                <h3>{user.nombre}</h3>
                                <span>{user.rol || "Usuario"}</span>
                                <p>{user.correo}</p>

                                <button onClick={() => deleteUser(user.id_usuario)}>
                                    <FiTrash2 /> Eliminar cuenta
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2>
                        <FiLayers style={{ color: "#9b59b6" }} /> Galería de Publicaciones
                    </h2>
                    <div className="grid">
                        {pins.map(pin => (
                            <div key={pin.id_pin} className="card">
                                <h3>{pin.categoria || "Idea"}</h3>
                                <p>{pin.descripcion}</p>
                                <p>{pin.texto}</p>

                                <button onClick={() => deletePin(pin.id_pin)}>
                                    <FiTrash2 /> Retirar Contenido
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AdminDashboard;