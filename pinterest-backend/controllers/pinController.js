const db = require("../config/db");

// GET pins
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

// CREATE pin
const createPin = async (req, res) => {
    try {
        const { categoria, descripcion, texto } = req.body;

        const [result] = await db.execute(
            "INSERT INTO pines (categoria, descripcion, texto) VALUES (?, ?, ?)",
            [categoria, descripcion, texto]
        );

        res.status(201).json({
            id_pin: result.insertId,
            categoria,
            descripcion,
            texto
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear pin"
        });
    }
};
// ELIMINAR PIN (ADMIN)
const deletePin = (req, res) => {
    
    const { id } = req.params;

    const sql = "DELETE FROM pines WHERE id_pin = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                mensaje: "Error al eliminar pin",
                err
            });
        }

        res.json({
            mensaje: "Pin eliminado correctamente"
        });
    });
};

module.exports = {
    getPins,
    createPin,
    deletePin
};