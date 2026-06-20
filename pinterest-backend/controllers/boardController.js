const db = require("../config/db");

// Verifica que el tablero exista y pertenezca al usuario autenticado.
// Devuelve el tablero o null si no existe / no es del usuario.
const obtenerTableroPropio = async (id_tablero, id_usuario) => {
    const [rows] = await db.execute(
        "SELECT * FROM tableros WHERE id_tablero = ?",
        [id_tablero]
    );

    if (!rows || rows.length === 0) {
        return { existe: false, propio: false, tablero: null };
    }

    const tablero = rows[0];
    return {
        existe: true,
        propio: tablero.id_usuario === id_usuario,
        tablero
    };
};

// LISTAR LOS TABLEROS DEL USUARIO AUTENTICADO (con conteo de pines)
const getMyBoards = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;

        const [rows] = await db.execute(
            `SELECT t.id_tablero, t.nombre, t.id_usuario, t.fecha_creacion,
                    COUNT(tp.id_pin) AS total_pines
             FROM tableros t
             LEFT JOIN tablero_pines tp ON tp.id_tablero = t.id_tablero
             WHERE t.id_usuario = ?
             GROUP BY t.id_tablero
             ORDER BY t.id_tablero DESC`,
            [id_usuario]
        );

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener los tableros" });
    }
};

// OBTENER UN TABLERO Y SUS PINES (solo el dueño)
const getBoardById = async (req, res) => {
    try {
        const { id } = req.params;
        const id_usuario = req.usuario.id;

        const { existe, propio, tablero } = await obtenerTableroPropio(id, id_usuario);

        if (!existe) {
            return res.status(404).json({ mensaje: "Tablero no encontrado" });
        }
        if (!propio) {
            return res.status(403).json({ mensaje: "No autorizado para ver este tablero" });
        }

        const [pines] = await db.execute(
            `SELECT p.*
             FROM pines p
             INNER JOIN tablero_pines tp ON tp.id_pin = p.id_pin
             WHERE tp.id_tablero = ?
             ORDER BY tp.id_tablero_pin DESC`,
            [id]
        );

        res.json({ ...tablero, total_pines: pines.length, pines });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener el tablero" });
    }
};

// CREAR TABLERO
const createBoard = async (req, res) => {
    try {
        const { nombre } = req.body;
        const id_usuario = req.usuario.id;

        if (!nombre || !nombre.trim()) {
            return res.status(400).json({ mensaje: "El nombre del tablero es obligatorio" });
        }

        const [result] = await db.execute(
            "INSERT INTO tableros (nombre, id_usuario) VALUES (?, ?)",
            [nombre.trim(), id_usuario]
        );

        res.status(201).json({
            id_tablero: result.insertId,
            nombre: nombre.trim(),
            id_usuario,
            total_pines: 0
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al crear el tablero" });
    }
};

// EDITAR EL NOMBRE DE UN TABLERO (solo el dueño)
const updateBoard = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        const id_usuario = req.usuario.id;

        if (!nombre || !nombre.trim()) {
            return res.status(400).json({ mensaje: "El nombre del tablero es obligatorio" });
        }

        const { existe, propio } = await obtenerTableroPropio(id, id_usuario);

        if (!existe) {
            return res.status(404).json({ mensaje: "Tablero no encontrado" });
        }
        if (!propio) {
            return res.status(403).json({ mensaje: "No autorizado para editar este tablero" });
        }

        await db.execute(
            "UPDATE tableros SET nombre = ? WHERE id_tablero = ?",
            [nombre.trim(), id]
        );

        res.json({ id_tablero: Number(id), nombre: nombre.trim(), id_usuario });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al actualizar el tablero" });
    }
};

// ELIMINAR TABLERO (solo el dueño y solo si está vacío)
const deleteBoard = async (req, res) => {
    try {
        const { id } = req.params;
        const id_usuario = req.usuario.id;

        const { existe, propio } = await obtenerTableroPropio(id, id_usuario);

        if (!existe) {
            return res.status(404).json({ mensaje: "Tablero no encontrado" });
        }
        if (!propio) {
            return res.status(403).json({ mensaje: "No autorizado para eliminar este tablero" });
        }

        const [[{ total }]] = await db.execute(
            "SELECT COUNT(*) AS total FROM tablero_pines WHERE id_tablero = ?",
            [id]
        );

        if (total > 0) {
            return res.status(400).json({
                mensaje: "Solo puedes eliminar tableros vacíos. Quita primero sus pines."
            });
        }

        await db.execute("DELETE FROM tableros WHERE id_tablero = ?", [id]);

        res.json({ mensaje: "Tablero eliminado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al eliminar el tablero" });
    }
};

// AGREGAR UN PIN A UN TABLERO (solo el dueño del tablero)
const addPinToBoard = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_pin } = req.body;
        const id_usuario = req.usuario.id;

        if (!id_pin) {
            return res.status(400).json({ mensaje: "El id del pin es obligatorio" });
        }

        const { existe, propio } = await obtenerTableroPropio(id, id_usuario);

        if (!existe) {
            return res.status(404).json({ mensaje: "Tablero no encontrado" });
        }
        if (!propio) {
            return res.status(403).json({ mensaje: "No autorizado para modificar este tablero" });
        }

        const [pin] = await db.execute(
            "SELECT id_pin FROM pines WHERE id_pin = ?",
            [id_pin]
        );

        if (!pin || pin.length === 0) {
            return res.status(404).json({ mensaje: "El pin no existe" });
        }

        try {
            await db.execute(
                "INSERT INTO tablero_pines (id_tablero, id_pin) VALUES (?, ?)",
                [id, id_pin]
            );
        } catch (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ mensaje: "El pin ya está guardado en este tablero" });
            }
            throw err;
        }

        res.status(201).json({ mensaje: "Pin guardado en el tablero", id_tablero: Number(id), id_pin });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al guardar el pin en el tablero" });
    }
};

// QUITAR UN PIN DE UN TABLERO (solo el dueño del tablero)
const removePinFromBoard = async (req, res) => {
    try {
        const { id, pinId } = req.params;
        const id_usuario = req.usuario.id;

        const { existe, propio } = await obtenerTableroPropio(id, id_usuario);

        if (!existe) {
            return res.status(404).json({ mensaje: "Tablero no encontrado" });
        }
        if (!propio) {
            return res.status(403).json({ mensaje: "No autorizado para modificar este tablero" });
        }

        await db.execute(
            "DELETE FROM tablero_pines WHERE id_tablero = ? AND id_pin = ?",
            [id, pinId]
        );

        res.json({ mensaje: "Pin quitado del tablero" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al quitar el pin del tablero" });
    }
};

module.exports = {
    getMyBoards,
    getBoardById,
    createBoard,
    updateBoard,
    deleteBoard,
    addPinToBoard,
    removePinFromBoard
};
