const express = require("express");
const router = express.Router();
const db = require("../config/db"); 

// Endpoint para GUARDAR un pin de texto (El que tú necesitas)
router.post("/", async (req, res) => {
    try {
        const { categoria, descripcion, texto } = req.body;
        
        const query = "INSERT INTO pines (categoria, descripcion, texto) VALUES (?, ?, ?)";
        const [result] = await db.execute(query, [categoria, descripcion, texto]);
        
        // Te regresa el objeto con el id creado por MySQL
        res.status(201).json({ id_pin: result.insertId, categoria, descripcion, texto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error en el servidor al insertar" });
    }
});

// Endpoint para TRAER todos los pines (Para tu useEffect del Feed)
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM pines ORDER BY id_pin DESC");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al traer pines" });
    }
});

module.exports = router;