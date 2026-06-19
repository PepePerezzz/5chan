const db = require("../config/db");


const getPins = async (req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT * FROM pines ORDER BY id_pin DESC"
        );

        res.json(rows);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener pines"
        });
    }
};

// crea el pin y esta vinculado al id_usuario del Token
const createPin = async (req, res) => {
    try {
        const { categoria, descripcion, texto } = req.body;
        const id_usuario = req.usuario.id; 

        const [result] = await db.execute(
            "INSERT INTO pines (categoria, descripcion, texto, id_usuario) VALUES (?, ?, ?, ?)",
            [categoria, descripcion, texto, id_usuario]
        );

        res.status(201).json({
            id_pin: result.insertId,
            id_usuario,
            categoria,
            descripcion,
            texto
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al crear pin"
        });
    }
};

// ELIMINAR PIN (ADMIN)
const deletePin = async (req, res) => {
    try {
        const { id } = req.params;

        await db.execute(
            "DELETE FROM pines WHERE id_pin = ?",
            [id]
        );

        res.json({
            mensaje: "Pin eliminado correctamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Error al eliminar pin"
        });
    }
};

// ACTUALIZAR PIN (propietario o admin)
const updatePin = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoria, descripcion, texto } = req.body;
        const usuarioId = req.usuario.id;

        const [rows] = await db.execute(
            "SELECT * FROM pines WHERE id_pin = ?",
            [id]
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({ mensaje: "Pin no encontrado" });
        }

        const pin = rows[0];

        // permitir si es el dueño o si es admin
        if (pin.id_usuario !== usuarioId && req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: "No autorizado para editar este pin" });
        }

        await db.execute(
            "UPDATE pines SET categoria = ?, descripcion = ?, texto = ? WHERE id_pin = ?",
            [categoria, descripcion, texto, id]
        );

        res.json({
            id_pin: Number(id),
            id_usuario: pin.id_usuario,
            categoria,
            descripcion,
            texto
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al actualizar pin" });
    }
};

module.exports = {
    getPins,
    createPin,
    deletePin,
    updatePin
};