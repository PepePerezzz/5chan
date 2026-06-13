const db = require("../config/db");

// OBTENER USUARIOS
const getUsers = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id_usuario, nombre, correo, rol FROM usuarios"
        );

        res.json(rows);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener usuarios",
            error
        });
    }
};

// ELIMINAR USUARIO
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            "DELETE FROM usuarios WHERE id_usuario = ?",
            [id]
        );

        res.json({ mensaje: "Usuario eliminado" });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar usuario",
            error
        });
    }
};

module.exports = {
    getUsers,
    deleteUser
};