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
module.exports = {
    crearUsuario,
    buscarPorCorreo
};