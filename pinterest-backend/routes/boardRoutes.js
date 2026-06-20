const express = require("express");
const router = express.Router();

const verificarToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
    getMyBoards,
    getBoardById,
    createBoard,
    updateBoard,
    deleteBoard,
    addPinToBoard,
    removePinFromBoard
} = require("../controllers/boardController");

// Todas las rutas de tableros requieren usuario autenticado.
// La pertenencia (que el tablero sea del usuario) se valida en el controlador.
router.use(verificarToken, authorizeRoles("usuario", "admin"));

// Tableros del usuario autenticado
router.get("/", getMyBoards);
router.post("/", createBoard);

// Un tablero concreto y sus pines
router.get("/:id", getBoardById);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);

// Pines dentro de un tablero
router.post("/:id/pins", addPinToBoard);
router.delete("/:id/pins/:pinId", removePinFromBoard);

module.exports = router;
