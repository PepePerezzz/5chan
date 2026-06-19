const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const register = async (req, res) => {

    try {

        const { nombre, correo, password } = req.body;

        if (!nombre || !correo || !password) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios"
            });
        }

        const results = await User.buscarPorCorreo(correo);

        if (results.length > 0) {
            return res.status(400).json({
                mensaje: "El correo ya existe"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        await User.crearUsuario(
            nombre,
            correo,
            hashedPassword,
            "usuario"
        );

        res.status(201).json({
            mensaje: "Usuario registrado"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error del servidor"
        });

    }

};

const login = async (req, res) => {

    try {

        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios"
            });
        }

        const results = await User.buscarPorCorreo(
            correo
        );

        if (results.length === 0) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        const usuario = results[0];

        const coincide = await bcrypt.compare(
            password,
            usuario.contraseña
        );

        if (!coincide) {
            return res.status(401).json({
                mensaje: "Contraseña incorrecta"
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );

        res.status(200).json({
            mensaje: "Login exitoso",
            token,
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error del servidor"
        });

    }

};

const buscarUsuarios = async (req, res) => {
    try {
        const { nombre } = req.query;

        if (!nombre || nombre.trim().length < 2) {
            return res.json([]);
        }

        const usuarios = await User.buscarPorNombre(nombre.trim());

        res.json(usuarios);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al buscar usuarios"
        });
    }
};

module.exports = {
    register,
    buscarUsuarios,
    login
};