const Tablero = require("../models/tableroModel");

// Crear un tablero nuevo 
const createTablero = async (req, res) => {
    try {
        const { nombre } = req.body;
        const id_usuario = req.usuario.id;

        if (!nombre) {
            return res.status(400).json({
                mensaje: "El nombre del tablero es obligatorio"
            });
        }

        const id_tablero = await Tablero.crearTablero(nombre, id_usuario);

        res.status(201).json({
            id_tablero,
            nombre,
            id_usuario
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al crear tablero"
        });
    }
};

// Obtener los tableros de un usuario (propio o de otro perfil)
const getTablerosPorUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        const tableros = await Tablero.obtenerTablerosPorUsuario(id_usuario);

        res.json(tableros);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al obtener tableros"
        });
    }
};

// Obtener los pines dentro de un tablero específico
const getPinesDeTablero = async (req, res) => {
    try {
        const { id } = req.params;

        const tablero = await Tablero.obtenerTableroPorId(id);

        if (!tablero) {
            return res.status(404).json({
                mensaje: "Tablero no encontrado"
            });
        }

        const pines = await Tablero.obtenerPinesDeTablero(id);

        res.json({
            tablero,
            pines
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al obtener pines del tablero"
        });
    }
};

// Agregar un pin del feed a uno de mis tableros
const addPinATablero = async (req, res) => {
    try {
        const { id } = req.params; // id_tablero
        const { id_pin } = req.body;
        const id_usuario = req.usuario.id;

        const tablero = await Tablero.obtenerTableroPorId(id);

        if (!tablero) {
            return res.status(404).json({
                mensaje: "Tablero no encontrado"
            });
        }

        // Solo el dueño del tablero puede agregarle pines
        if (tablero.id_usuario !== id_usuario) {
            return res.status(403).json({
                mensaje: "No puedes modificar un tablero que no es tuyo"
            });
        }

        await Tablero.agregarPinATablero(id, id_pin);

        res.status(201).json({
            mensaje: "Pin agregado al tablero"
        });

    } catch (error) {
        // Si choca con la UNIQUE KEY, significa que ya estaba agregado
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                mensaje: "Ese pin ya está en este tablero"
            });
        }

        console.error(error);
        res.status(500).json({
            mensaje: "Error al agregar pin al tablero"
        });
    }
};

// Quitar un pin de uno de mis tableros
const removePinDeTablero = async (req, res) => {
    try {
        const { id, id_pin } = req.params;
        const id_usuario = req.usuario.id;

        const tablero = await Tablero.obtenerTableroPorId(id);

        if (!tablero) {
            return res.status(404).json({
                mensaje: "Tablero no encontrado"
            });
        }

        if (tablero.id_usuario !== id_usuario) {
            return res.status(403).json({
                mensaje: "No puedes modificar un tablero que no es tuyo"
            });
        }

        await Tablero.quitarPinDeTablero(id, id_pin);

        res.json({
            mensaje: "Pin eliminado del tablero"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al quitar pin del tablero"
        });
    }
};

// Eliminar un tablero completo 
const deleteTablero = async (req, res) => {
    try {
        const { id } = req.params;
        const id_usuario = req.usuario.id;

        const tablero = await Tablero.obtenerTableroPorId(id);

        if (!tablero) {
            return res.status(404).json({
                mensaje: "Tablero no encontrado"
            });
        }

        if (tablero.id_usuario !== id_usuario) {
            return res.status(403).json({
                mensaje: "No puedes eliminar un tablero que no es tuyo"
            });
        }

        await Tablero.eliminarTablero(id);

        res.json({
            mensaje: "Tablero eliminado correctamente"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al eliminar tablero"
        });
    }
};

module.exports = {
    createTablero,
    getTablerosPorUsuario,
    getPinesDeTablero,
    addPinATablero,
    removePinDeTablero,
    deleteTablero
};