import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/AdminDashboard.css";

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
        await axios.delete(`http://localhost:3000/api/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setUsers(users.filter(u => u.id_usuario !== id));
    };

    const deletePin = async (id) => {
        await axios.delete(`http://localhost:3000/api/pins/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setPins(pins.filter(p => p.id_pin !== id));
    };

    return (
        <div>
            <Navbar />

            <div className="admin-container">

                {/* USERS */}
                <section>
                    <h2>Usuarios</h2>
                    <div className="grid">
                        {users.map(user => (
                            <div key={user.id_usuario} className="card">
                                <h3>{user.nombre}</h3>
                                <p>{user.correo}</p>
                                <span>{user.rol}</span>

                                <button onClick={() => deleteUser(user.id_usuario)}>
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* PINS */}
                <section>
                    <h2>Pins</h2>
                    <div className="grid">
                        {pins.map(pin => (
                            <div key={pin.id_pin} className="card">
                                <h3>{pin.categoria}</h3>
                                <p>{pin.descripcion}</p>
                                <p>{pin.texto}</p>

                                <button onClick={() => deletePin(pin.id_pin)}>
                                    Eliminar
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