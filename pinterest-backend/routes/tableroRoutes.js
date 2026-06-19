const express = require("express");
const router = express.Router();

const verificarToken = require("../middleware/authMiddleware");

const {
    createTablero,
    getTablerosPorUsuario,
    getPinesDeTablero,
    addPinATablero,
    removePinDeTablero,
    deleteTablero
} = require("../controllers/tableroController");

router.post("/", verificarToken, createTablero);
router.get("/usuario/:id_usuario", getTablerosPorUsuario);
router.get("/:id/pines", getPinesDeTablero);
router.post("/:id/pines", verificarToken, addPinATablero);
router.delete("/:id/pines/:id_pin", verificarToken, removePinDeTablero);
router.delete("/:id", verificarToken, deleteTablero);

module.exports = router;