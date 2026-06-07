const express = require("express");

const router = express.Router();
const verificarToken = require("../middleware/authMiddleware");
const {
    register,
    login
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get(
    "/perfil",
    verificarToken,
    (req, res) => {

        res.json({
            mensaje: "Ruta protegida",
            usuario: req.usuario
        });

    }
);

module.exports = router;

