const db = require("../config/db");

const crearUsuario = async (nombre, correo, password, rol) => {

    const sql = `
        INSERT INTO usuarios
        (nombre, correo, contraseña, rol)
        VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.execute(
        sql,
        [nombre, correo, password, rol]
    );

    return result;
};

const buscarPorCorreo = async (correo) => {

    const sql = `
        SELECT *
        FROM usuarios
        WHERE correo = ?
    `;

    const [rows] = await db.execute(
        sql,
        [correo]
    );

    return rows;
};

const buscarPorNombre = async (nombre) => {

    const sql = `
        SELECT id_usuario, nombre, rol
        FROM usuarios
        WHERE nombre LIKE ?
        LIMIT 8
    `;

    const [rows] = await db.execute(
        sql,
        [`%${nombre}%`]
    );

    return rows;
};

module.exports = {
    crearUsuario,
    buscarPorCorreo,
    buscarPorNombre
};