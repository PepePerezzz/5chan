const db = require("../config/db");

// Crear un tablero nuevo
const crearTablero = async (nombre, id_usuario) => {
    const [result] = await db.execute(
        "INSERT INTO tableros (nombre, id_usuario) VALUES (?, ?)",
        [nombre, id_usuario]
    );
    return result.insertId;
};

// Obtener todos los tableros de un usuario 
const obtenerTablerosPorUsuario = async (id_usuario) => {
    const [rows] = await db.execute(
        "SELECT * FROM tableros WHERE id_usuario = ? ORDER BY id_tablero DESC",
        [id_usuario]
    );
    return rows;
};

// Obtener un tablero por su id 
const obtenerTableroPorId = async (id_tablero) => {
    const [rows] = await db.execute(
        "SELECT * FROM tableros WHERE id_tablero = ?",
        [id_tablero]
    );
    return rows[0];
};

// Agregar un pin existente a un tablero
const agregarPinATablero = async (id_tablero, id_pin) => {
    const [result] = await db.execute(
        "INSERT INTO tablero_pines (id_tablero, id_pin) VALUES (?, ?)",
        [id_tablero, id_pin]
    );
    return result.insertId;
};

// Quitar un pin de un tablero
const quitarPinDeTablero = async (id_tablero, id_pin) => {
    await db.execute(
        "DELETE FROM tablero_pines WHERE id_tablero = ? AND id_pin = ?",
        [id_tablero, id_pin]
    );
};

// Obtener los pines que contiene un tablero específico
const obtenerPinesDeTablero = async (id_tablero) => {
    const [rows] = await db.execute(
        `SELECT p.* FROM pines p
         INNER JOIN tablero_pines tp ON p.id_pin = tp.id_pin
         WHERE tp.id_tablero = ?
         ORDER BY tp.fecha_agregado DESC`,
        [id_tablero]
    );
    return rows;
};

// Eliminar un tablero completo
const eliminarTablero = async (id_tablero) => {
    await db.execute(
        "DELETE FROM tableros WHERE id_tablero = ?",
        [id_tablero]
    );
};

module.exports = {
    crearTablero,
    obtenerTablerosPorUsuario,
    obtenerTableroPorId,
    agregarPinATablero,
    quitarPinDeTablero,
    obtenerPinesDeTablero,
    eliminarTablero
};