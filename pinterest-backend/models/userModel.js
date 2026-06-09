const db = require("../config/db");

const crearUsuario = (nombre, correo, password, rol, callback) => {

    const sql = `INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES (?, ?, ?, ?)`;

    db.query(
        sql,
        [nombre, correo, password, rol], 
        callback
    );
};

const buscarPorCorreo = (correo, callback) => {

    const sql = `SELECT * FROM usuarios WHERE correo = ?`;

    db.query(sql, [correo], callback);
};

module.exports = {
    crearUsuario,
    buscarPorCorreo
};