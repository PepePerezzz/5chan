const express = require("express");
const authorizeRoles = require("../middleware/authorizeRoles");
const router = express.Router();
const verificarToken = require("../middleware/authMiddleware");
const {
    register,
    login,
    buscarUsuarios 
} = require("../controllers/authController");

router.get("/buscar", buscarUsuarios);
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

