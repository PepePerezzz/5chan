const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            mensaje: "Token requerido"
        });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({
            mensaje: "Formato de token inválido"
        });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = decoded;

        next();
    } catch (error) {
        return res.status(403).json({
            mensaje: "Token inválido"
        });
    }
};

module.exports = verificarToken;